/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';


import {SketchCanvas, SketchCanvasRef} from 'rn-perfect-sketch-canvas';
import Share from 'react-native-share';
import {ImageFormat} from '@shopify/react-native-skia';
import RNFS from 'react-native-fs';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {}, []);

  const canvasRef = React.useRef<SketchCanvasRef>(null);

  const [color, setColor] = React.useState('white');
  const [stroke, setStroke] = React.useState(5);
  const [isEraser, setIsEraser] = React.useState(false);

  const [showModal, setShowModal] = React.useState(false);
  const [showPenModal, setShowPenModal] = React.useState(false);

  const colorsList = [
    {
      hexCode: '#000000',
    },
    {
      hexCode: '#C0c0c0',
    },
    {
      hexCode: '#808080',
    },
    {
      hexCode: '#800000',
    },
    {
      hexCode: '#F00000',
    },
    {
      hexCode: '#800080',
    },
    {
      hexCode: '#F00FFF',
    },
    {
      hexCode: '#008000',
    },
    {
      hexCode: '#00FF00',
    },
    {
      hexCode: '#808000',
    },
    {
      hexCode: '#FFF000',
    },
    {
      hexCode: '#00080',
    },
    {
      hexCode: '#0000ff',
    },
    {
      hexCode: '#008080',
    },
    {
      hexCode: '#00ffff',
    },
  ];

  const penSize = [8, 10, 20, 30, 40];

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        'Save remote Image',
        'Grant Me Permission to save Image',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    } catch (err) {
      Alert.alert(
        'Save remote Image',
        'Failed to save Image: ' + err.message,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const getPermissionsAndSaveImage = async () => {
    // if device is android you have to ensure you have permission
    if (Platform.OS === 'android') {
      const granted = await getPermissionAndroid();
      if (!granted) {
        return;
      } else {
        saveImage();
      }
    }
  };

  const ShowModalColors = () => {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>Select Color</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', padding: 10}}>
          {colorsList.map((v, i) => {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setColor(v.hexCode);
                  setTimeout(() => {
                    setShowModal(false);
                  }, 1000);
                }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  borderWidth: color == v.hexCode ? 5 : 1,
                  backgroundColor: v.hexCode,
                  margin: 10,
                }}></TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const ShowModalPenType = () => {
    return (
      <View style={styles.modalContainer}>
        <Text style={styles.modalHeader}>Select Pen Type</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {penSize.map((v, i) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setStroke(v);
                  setTimeout(() => {
                    setShowPenModal(false);
                  }, 1000);
                }}
                key={i}>
                <View
                  key={i}
                  style={{
                    width: v,
                    height: v,
                    borderRadius: v * 30,
                    borderWidth: stroke == v ? 5 : 1,
                    backgroundColor: color,
                    margin: 10,
                  }}></View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const saveImage = () => {
    const file_path = RNFS.DownloadDirectoryPath + '/sampleImage.jpeg';
    const base64 = canvasRef.current.toBase64(ImageFormat.JPEG, 100);
    RNFS.writeFile(file_path, base64, 'base64')
      .then(e => {
        alert('Image saved to /Downloads successfully');
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  };

  const changeColor = () => {
    setIsEraser(false);
    setShowModal(true);
  };

  const exportImage = () => {
    if (canvasRef.current != null) {

      const base64 = canvasRef.current.toBase64(ImageFormat.JPEG, 100);
      const imageUrl = 'data:image/jpeg;base64,' + base64;
      const shareOptions = {
        title: 'Share',
        message: 'Sharing this image',
        urls: [imageUrl],
        subject: 'Image Share',
      };
      Share.open(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    }
  };

  const setPenStroke = () => {
    setIsEraser(false);
    setShowPenModal(true);
  };

  const redoFunction = () => {
    if (canvasRef.current != null) {
      canvasRef.current.redo();
    }
  };

  const undoFunction = () => {
    if (canvasRef.current != null) {
      canvasRef.current.undo();
    }
  };

  const menuitems = [
    {
      textImage: '↶',
      text: 'undo',
      function: () => undoFunction(),
    },
    {
      textImage: '↷',
      text: 'redo',
      function: () => redoFunction(),
    },
    {
      textImage: '▭',
      text: 'erase',
      function: () => {
        
        setIsEraser(!isEraser);
      },
    },
    {
      textImage: '✎',
      text: 'color',
      function: () => changeColor(),
    },
    {
      textImage: '',
      text: '',
      function: () => setPenStroke(),
    },
    {
      textImage: '📂',
      text: 'save',
      function: () => getPermissionsAndSaveImage(),
    },
    {
      textImage: require('./images/export.png'),
      text: 'export',
      function: () => exportImage(),
    },
  ];

  const menuitemList = (v,i) =>{
    return (
      <TouchableOpacity
        key={i}
        style={[styles.menuLayout,{backgroundColor:isEraser && v.text == 'erase'? 'grey' : 'transparent'}]}
        onPress={() => {
          v.function();
        }}>
        {v.text == '' ? (
          <View
            style={{
              width: stroke,
              height: stroke,
              borderRadius: stroke * 30,
              backgroundColor: color,
              margin: 10,
            }}></View>
        ) : (
          <>
            {v.text == 'export' ? (
              <Image
                style={[
                  {width: 20, height: 20, tintColor: 'grey'},
                ]}
                source={require('./images/export.png')}
              />
            ) : (
              <Text style={styles.imageStyle}>{v.textImage}</Text>
            )}
            <Text style={styles.textStyle}>{v.text}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SketchCanvas
          ref={canvasRef}
          strokeColor={isEraser ? 'trnasparent' : color}
          strokeWidth={isEraser ? 45 : showModal || showPenModal ? 0 : stroke}
          containerStyle={{
            width: '100%',
            height: '75%',
            borderWidth: 1,
            elevation: 5,
            backgroundColor: 'black',
            
          }}
        />
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {menuitems.map((v,i) => menuitemList(v,i)
          )}
        </View>
        {showModal && <ShowModalColors />}
        {showPenModal && <ShowModalPenType />}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  modalHeader: {fontSize: 20, color: 'black'},
  modalContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    padding: 10,
  },
  textStyle: {textAlign: 'center', fontSize: 20},
  imageStyle: {textAlign: 'center', fontSize: 20},
  menuLayout: {
    width: '20%',
    borderWidth: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    margin: 10,
    borderRadius: 30,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

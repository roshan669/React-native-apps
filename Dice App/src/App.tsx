import React, {useState} from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  Vibration,
} from 'react-native';
const DiceOne = require('../assets/One.png');
const DiceTwo = require('../assets/Two.png');
const DiceThree = require('../assets/Three.png');
const DiceFour = require('../assets/Four.png');
const DiceFive = require('../assets/Five.png');
const DiceSix = require('../assets/Six.png');

const Dice = ({
  imageUrl,
}: {
  imageUrl: ImageSourcePropType;
}): React.JSX.Element => {
  return (
    <View>
      <Image style={styles.diceImage} source={imageUrl} />
    </View>
  );
};

function App(): React.JSX.Element {
  const [diceImage, setDiceImage] = useState<ImageSourcePropType>(DiceOne);

  const rollDiceOnTap = () => {
    let randomNumber = Math.floor(Math.random() * 6) + 1;

    switch (randomNumber) {
      case 1:
        setDiceImage(DiceOne);
        break;
      case 2:
        setDiceImage(DiceTwo);
        break;
      case 3:
        setDiceImage(DiceThree);
        break;
      case 4:
        setDiceImage(DiceFour);
        break;
      case 5:
        setDiceImage(DiceFive);
        break;
      case 6:
        setDiceImage(DiceSix);
        break;

      default:
        setDiceImage(DiceOne);
    }
    Vibration.vibrate(100);
  };

  return (
    <Pressable onPress={rollDiceOnTap} style={styles.container}>
      <Dice imageUrl={diceImage} />

      <Text style={styles.rollDiceBtnText}> Touch the Screen to Roll</Text>
      <Text style={styles.credit}>❤️ ROSHAN</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diceImage: {
    width: 200,
    height: 200,
  },
  rollDiceBtnText: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#E5E0FF',
    fontSize: 16,
    color: '#8EA7E9',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  credit: {
    color: '#FFF',
    marginTop: 5,
  },
});

export default App;

import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
export default {
    // placeHolder: '#9f7676',
    placeHolder: 'rgba(117,113,154,1)',
    buttonColor: '#d3a3f9',
    textColor: '#3f016e',
    textInputBg: 'rgba(197,198,186,1)',
    mediumTint: 'rgba(107,0,188,1)',
    lightTint: 'rgba(177,77,255,1)',
    evenLighterTint: 'rgba(193,113,255,1)',
    buttonPurple: 'rgba(155,97,234,1)',
    buttonPink: 'rgba(252,140,250,1)',
    buttonPinkTransparent: 'rgba(252,140,250,.25)',
    pinkLESSTransparent: 'rgba(252,180,250,.70)',
    bottomBorderTint: 'rgba(177,77,255,1)',
    transparentModal: 'rgba(0,0,0,0.43)',
    yellow: 'rgba(255, 237, 187, 1)',
    blue: 'rgba(150, 227, 255, 1)',
    blue2: 'rgba(72,150,239,1)',
    blue3: 'rgba(67,97,238,1)',
    blue4: 'rgba(1,53,139,1)',
    pinkUnderLine: '#e896be',

    maxFontSizeMultiplier: 1.2,
    screenHeight: height,
    screenWidth: width,

    rowHeight: height + 80,

    androidFont: 'open-sans',
    androidFontBold: 'open-sans-bold',
}

import React, { useEffect } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Path, LinearGradient, Stop, Defs } from 'react-native-svg';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface ShapesBackgroundAnimationProps {
  width: number;
  height: number;
}

const ShapesBackgroundAnimation = ({
  width = 200,
  height = 200,
}: ShapesBackgroundAnimationProps) => {
  const spinValue = React.useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 50000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      testID="shapes-background-animation"
      style={[
        styles.container,
        {
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <Svg width={width} height={height} viewBox="0 0 401 376" fill="none">
        <Path
          d="M383.205 167.402C382.77 167.402 382.335 167.287 381.958 167.055L348.55 147.294C347.738 146.802 347.274 145.877 347.361 144.951C347.477 143.996 348.115 143.215 349.014 142.926L397.183 127.273C398.082 126.984 399.068 127.244 399.706 127.939C400.344 128.633 400.518 129.646 400.17 130.514L385.409 165.927C385.148 166.563 384.597 167.084 383.93 167.287C383.698 167.344 383.466 167.402 383.205 167.402ZM355.626 145.848L382.016 161.471L393.674 133.494L355.626 145.848Z"
          fill="#75C4FD"
        />
        <Path
          d="M317.736 91.7651C317.359 91.7651 316.953 91.7362 316.576 91.6783C311.704 91.0418 308.282 86.5862 308.891 81.7256C309.21 79.3821 310.399 77.27 312.284 75.8234C314.169 74.3768 316.518 73.7403 318.867 74.0585C321.216 74.3768 323.333 75.563 324.783 77.4436C326.233 79.3242 326.871 81.6677 326.552 84.0112C325.943 88.5247 322.115 91.7651 317.736 91.7651ZM317.707 76.7492C316.344 76.7492 315.039 77.1832 313.966 78.0223C312.661 79.0349 311.82 80.4815 311.617 82.1017C311.182 85.4579 313.56 88.5536 316.924 89.0165C320.288 89.4505 323.391 87.0781 323.855 83.7219C324.058 82.1017 323.623 80.4815 322.637 79.1795C321.622 77.8776 320.172 77.0386 318.548 76.836C318.258 76.7492 317.968 76.7492 317.707 76.7492Z"
          fill="#86E29B"
        />
        <Path
          d="M46.8495 93.5556C46.7045 93.5556 46.5595 93.5556 46.4145 93.5556C43.7756 93.4399 41.3396 92.3116 39.5416 90.3731C35.8587 86.3804 36.1197 80.1021 40.1216 76.4277C44.1236 72.7533 50.4165 73.0137 54.0994 77.0063C55.8974 78.9448 56.8254 81.4619 56.7094 84.0948C56.5934 86.7276 55.4624 89.1579 53.5195 90.9517C51.6925 92.6587 49.3435 93.5556 46.8495 93.5556ZM46.8205 76.5723C45.0806 76.5723 43.3696 77.1799 41.9776 78.453C39.0776 81.1147 38.9036 85.6282 41.5716 88.5214C42.8766 89.9102 44.6166 90.7492 46.5306 90.8071C48.4445 90.8939 50.2425 90.2284 51.6635 88.9265C53.0555 87.6245 53.8965 85.8886 53.9544 83.979C54.0414 82.0695 53.3745 80.2757 52.0695 78.858C50.6775 77.3535 48.7635 76.5723 46.8205 76.5723Z"
          fill="#FFB0EB"
        />
        <Path
          d="M272.757 111.15C274.614 111.15 276.121 109.647 276.121 107.794C276.121 105.94 274.614 104.438 272.757 104.438C270.899 104.438 269.393 105.94 269.393 107.794C269.393 109.647 270.899 111.15 272.757 111.15Z"
          fill="url(#paint0_linear)"
        />
        <Path
          d="M3.70979 205.209C5.56765 205.209 7.07375 203.706 7.07375 201.852C7.07375 199.999 5.56765 198.496 3.70979 198.496C1.85192 198.496 0.345825 199.999 0.345825 201.852C0.345825 203.706 1.85192 205.209 3.70979 205.209Z"
          fill="url(#paint1_linear)"
        />
        <Path
          d="M191.764 300.202C193.622 300.202 195.128 298.699 195.128 296.846C195.128 294.992 193.622 293.49 191.764 293.49C189.906 293.49 188.4 294.992 188.4 296.846C188.4 298.699 189.906 300.202 191.764 300.202Z"
          fill="url(#paint2_linear)"
        />
        <Path
          d="M122.713 65.5111C125.724 65.5111 128.165 63.0759 128.165 60.0718C128.165 57.0678 125.724 54.6326 122.713 54.6326C119.702 54.6326 117.261 57.0678 117.261 60.0718C117.261 63.0759 119.702 65.5111 122.713 65.5111Z"
          fill="url(#paint3_linear)"
        />
        <Path
          d="M201.658 205.313C204.669 205.313 207.11 202.878 207.11 199.874C207.11 196.87 204.669 194.435 201.658 194.435C198.647 194.435 196.206 196.87 196.206 199.874C196.206 202.878 198.647 205.313 201.658 205.313Z"
          fill="url(#paint4_linear)"
        />
        <Path
          d="M108.712 356.439C111.723 356.439 114.164 354.003 114.164 350.999C114.164 347.995 111.723 345.56 108.712 345.56C105.701 345.56 103.26 347.995 103.26 350.999C103.26 354.003 105.701 356.439 108.712 356.439Z"
          fill="url(#paint5_linear)"
        />
        <Path
          d="M352.967 343.485C355.978 343.485 358.419 341.05 358.419 338.046C358.419 335.042 355.978 332.607 352.967 332.607C349.956 332.607 347.515 335.042 347.515 338.046C347.515 341.05 349.956 343.485 352.967 343.485Z"
          fill="url(#paint6_linear)"
        />
        <Path
          d="M60.506 283.551C60.013 283.551 59.52 283.406 59.114 283.146C58.389 282.683 57.954 281.902 57.954 281.063L57.287 252.853C57.258 251.899 57.78 251.002 58.621 250.539C59.462 250.076 60.506 250.134 61.289 250.655L87.6207 268.188C88.4037 268.708 88.8386 269.634 88.7516 270.589C88.6646 271.544 88.0557 272.354 87.1857 272.73L61.521 283.406C61.173 283.493 60.825 283.551 60.506 283.551ZM62.536 257.656L63 277.157L80.7478 269.779L62.536 257.656Z"
          fill="#FFB0EB"
        />
        <Path
          d="M227.109 375.419C226.587 375.419 226.065 375.246 225.63 374.927L203.126 357.857C202.401 357.308 202.024 356.382 202.198 355.485C202.372 354.588 203.01 353.836 203.88 353.575L234.04 343.97C234.91 343.709 235.838 343.912 236.505 344.548C237.143 345.185 237.404 346.111 237.143 346.979L229.487 373.654C229.255 374.436 228.675 375.043 227.892 375.304C227.631 375.39 227.37 375.419 227.109 375.419ZM209.854 356.816L225.746 368.881L231.14 350.046L209.854 356.816Z"
          fill="url(#paint7_linear)"
        />
        <Path
          d="M188.09 12.8807C188.542 12.62 189.081 12.5096 189.617 12.568L217.651 16.1129C218.554 16.2269 219.344 16.8404 219.643 17.704C219.941 18.5677 219.765 19.5378 219.142 20.1977L197.832 43.578C197.209 44.238 196.303 44.526 195.407 44.3079C194.536 44.0753 193.847 43.4038 193.638 42.5218L186.914 15.5967C186.724 14.8043 186.922 13.9885 187.47 13.3719C187.653 13.1664 187.864 13.011 188.09 12.8807ZM212.346 20.3748L192.544 17.8627L197.301 36.868L212.346 20.3748Z"
          fill="url(#paint8_linear)"
        />
        <Path
          d="M343.904 258.709C343.817 258.709 343.759 258.709 343.672 258.709C334.595 258.593 327.287 251.1 327.403 242.044C327.519 232.988 335.001 225.697 344.107 225.813C353.183 225.929 360.491 233.422 360.375 242.478C360.259 251.476 352.893 258.709 343.904 258.709ZM343.904 230.095C337.263 230.095 331.782 235.447 331.695 242.102C331.608 248.814 337.002 254.34 343.73 254.427C350.458 254.543 355.996 249.132 356.083 242.42C356.17 235.708 350.776 230.182 344.049 230.095C344.02 230.095 343.962 230.095 343.904 230.095Z"
          fill="#86E29B"
        />
        <Path
          d="M79.4075 190.631C79.3205 190.631 79.2625 190.631 79.1755 190.631C70.0986 190.516 62.7906 183.022 62.9066 173.966C63.0226 164.91 70.5046 157.62 79.6105 157.735C88.6874 157.851 95.9953 165.344 95.8793 174.4C95.7633 183.398 88.3974 190.631 79.4075 190.631ZM79.4075 162.017C72.7665 162.017 67.2856 167.37 67.1986 174.024C67.1116 180.736 72.5056 186.263 79.2335 186.349C85.9614 186.465 91.5003 181.055 91.5873 174.342C91.6743 167.63 86.2804 162.104 79.5525 162.017C79.5235 162.017 79.4655 162.017 79.4075 162.017Z"
          fill="#86E29B"
        />
        <Defs>
          <LinearGradient
            id="paint0_linear"
            x1="269.393"
            y1="107.806"
            x2="276.123"
            y2="107.806"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="1" stopColor="#75C3FC" />
          </LinearGradient>
          <LinearGradient
            id="paint1_linear"
            x1="0.34336"
            y1="201.861"
            x2="7.07314"
            y2="201.861"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="1" stopColor="#75C3FC" />
          </LinearGradient>
          <LinearGradient
            id="paint2_linear"
            x1="188.398"
            y1="296.854"
            x2="195.128"
            y2="296.854"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="1" stopColor="#75C3FC" />
          </LinearGradient>
          <LinearGradient
            id="paint3_linear"
            x1="117.265"
            y1="60.2697"
            x2="128.184"
            y2="59.8808"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="1" stopColor="#75C3FC" />
          </LinearGradient>
          <LinearGradient
            id="paint4_linear"
            x1="196.21"
            y1="200.072"
            x2="207.129"
            y2="199.683"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="1" stopColor="#75C3FC" />
          </LinearGradient>
          <LinearGradient
            id="paint5_linear"
            x1="103.264"
            y1="351.197"
            x2="114.182"
            y2="350.808"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="1" stopColor="#75C3FC" />
          </LinearGradient>
          <LinearGradient
            id="paint6_linear"
            x1="347.519"
            y1="338.244"
            x2="358.437"
            y2="337.855"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="1" stopColor="#75C3FC" />
          </LinearGradient>
          <LinearGradient
            id="paint7_linear"
            x1="202.15"
            y1="359.64"
            x2="237.223"
            y2="359.64"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#FFE466" />
            <Stop offset="1" stopColor="#FFAFEA" />
          </LinearGradient>
          <LinearGradient
            id="paint8_linear"
            x1="216.961"
            y1="12.9932"
            x2="187.362"
            y2="31.2426"
            gradientUnits="userSpaceOnUse"
          >
            <Stop stopColor="#75C3FC" />
            <Stop offset="0.0928503" stopColor="#81C2F6" />
            <Stop offset="1" stopColor="#F0B8BD" />
          </LinearGradient>
        </Defs>
      </Svg>
    </Animated.View>
  );
};

export default ShapesBackgroundAnimation;

import { StyleSheet, View, Text } from 'react-native';
import React, { useState } from 'react';
import { Canvas, Rect, Group, Path, Mask } from '@shopify/react-native-skia';

const Card = () => {
  const [paths, setPaths] = useState([]);
  const [isScratched, setIsScratched] = useState(false); // State to track if scratched

  const onScratch = (x, y) => {
    // Create a small path for each touch point
    const newPath = `M${x - 20},${y - 20} h40 v40 h-40 z`; // Creates a square path for scratching
    setPaths((prevPaths) => [...prevPaths, newPath]);

    // Check if enough area has been scratched to reveal the text
    if (paths.length > 10) { // Adjust threshold as needed
      setIsScratched(true);
    }
  };

  return (
    <View style={styles.container}>
      <Canvas
        style={styles.skiaView}
        onTouchStart={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          onScratch(locationX, locationY);
        }}
        onTouchMove={(event) => {
          const { locationX, locationY } = event.nativeEvent;
          onScratch(locationX, locationY);
        }}
      >
        <Group>
          {/* Mask over the reward area */}
          <Mask
            mode="luminance"
            mask={
              <Group>
                {/* Draw each scratch path to incrementally reveal the reward */}
                {paths.map((d, index) => (
                  <Path key={index} path={d} color="black" />
                ))}
              </Group>
            }
          >
            <Rect x={0} y={0} width={200} height={100} color="#CCCCCC" />
          </Mask>
        </Group>
        
        {/* Draw color on scratch path */}
        <Group>
          {paths.map((d, index) => (
            <Path key={index} path={d} color="#f3aeff" /> 
          ))}
        </Group>
      </Canvas>
      
      {/* Display reward text only if scratched */}
      {isScratched && (
        <View style={styles.textContainer}>
          <Text style={styles.rewardText}>Your Reward: ₹100</Text>
        </View>
      )}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    position: 'relative',
  },
  skiaView: {
    flex: 1,
    backgroundColor:'#76077f' ,
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // Allow touch events to pass through
  },
  rewardText: {
    fontSize: 24,
    color: '#333',
  },
});

import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ControlCenter = () => {
  const playbackState = usePlaybackState();

  // Next button
  const skipToNext = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  // Previous button
  const skipToPrevious = async () => {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  const togglePlayback = async (currentState: State) => {
    const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();

    if (currentTrackIndex !== undefined) {
      const currentTrack = await TrackPlayer.getTrack(currentTrackIndex);
      if (currentTrack) {
        if (currentState === State.Paused || currentState === State.Ready) {
          await TrackPlayer.play();
        } else {
          await TrackPlayer.pause();
        }
      }
    }
  };

  if (playbackState.state === undefined) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={skipToPrevious}>
        <Icon style={styles.icon} name="skip-previous" size={40} />
      </Pressable>
      <Pressable onPress={() => togglePlayback(playbackState.state)}>
        <Icon
          style={styles.icon}
          name={playbackState.state === State.Playing ? 'pause' : 'play-arrow'}
          size={75}
        />
      </Pressable>
      <Pressable onPress={skipToNext}>
        <Icon style={styles.icon} name="skip-next" size={40} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 56,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    color: '#FFFFFF',
  },
});

export default ControlCenter;

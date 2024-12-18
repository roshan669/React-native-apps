import React, {useState, useMemo} from 'react';
import {Dimensions, FlatList, Image, StyleSheet, View} from 'react-native';
import TrackPlayer, {
  Event,
  Track,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import {playListData} from '../constants';
import SongInfo from '../components/Songinfo';
import SongSlider from '../components/SongSlider';
import ControlCenter from '../components/ControlCenter';

const {width} = Dimensions.get('window');

const MusicPlayer: React.FC = () => {
  const [track, setTrack] = useState<Track | null>(null);

  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], async event => {
    if (event.type === Event.PlaybackActiveTrackChanged) {
      try {
        const playingTrack = event.track
          ? await TrackPlayer.getTrack(event.track.id)
          : null;
        setTrack(playingTrack ?? null);
      } catch (error) {
        console.error('Error getting the active track:', error);
        setTrack(null);
      }
    }
  });

  const renderArtWork = useMemo(() => {
    return (
      <View style={styles.listArtWrapper}>
        <View style={styles.albumContainer}>
          {track?.artwork && (
            <Image
              style={styles.albumArtImg}
              source={{uri: track.artwork.toString()}}
            />
          )}
        </View>
      </View>
    );
  }, [track]);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={playListData}
        renderItem={() => renderArtWork}
        keyExtractor={song => song.id.toString()}
      />
      <SongInfo track={track} />
      <SongSlider />
      <ControlCenter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#001d23',
  },
  listArtWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumContainer: {
    width: 300,
    height: 300,
  },
  albumArtImg: {
    height: '100%',
    borderRadius: 4,
  },
});

export default MusicPlayer;

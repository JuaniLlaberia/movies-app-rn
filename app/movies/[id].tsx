import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import { useFetch } from '@/services/use-fetch';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-300 font-normal text-sm'>{label}</Text>
    <Text className='text-light-200 font-bold text-sm mt-2'>
      {value || 'N/A'}
    </Text>
  </View>
);

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => fetchMovieDetails({ movieId: id }));

  return (
    <View className='bg-primary flex-1'>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 80,
        }}
      >
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className='w-full h-[550px]'
            resizeMode='stretch'
          />
        </View>

        <View className='flex-col items-start justify-center mt-5 px-5'>
          <Text className='text-white font-bold text-xl'>{movie?.title}</Text>

          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-light-200 text-sm'>
              {movie?.release_date?.split('-')[0]}
            </Text>
            <Text className='text-light-200 text-sm'>{movie?.runtime}m</Text>
          </View>

          <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
            <Image
              source={icons.star}
              className='size-4'
            />
            <Text className='text-white font-bold text-sm'>
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className='text-light-200 text-sm'>
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo
            label='Overview'
            value={movie?.overview}
          />
          <MovieInfo
            label='Genres'
            value={movie?.genres?.map(g => g.name).join(' - ') || 'N/A'}
          />

          <View className='flex flex-row justify-between gap-x-16 w-1/2'>
            <MovieInfo
              label='Budget'
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label='Revenue'
              value={`$${Math.ceil(movie?.revenue ?? 0) / 1_000_000} million`}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Details;

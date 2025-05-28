import { useEffect, useState } from 'react';

import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovies } from '@/services/api';
import { useFetch } from '@/services/use-fetch';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';

import MovieCard from '../components/movie-card';
import SearchBar from '../components/search-bar';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: movies,
    loading,
    error,
    refetch,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchQuery.trim()) {
        await refetch();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <View className='flex-1 bg-primary'>
      <Image
        source={images.bg}
        className='flex-1 absolute w-full z-0'
        resizeMode='cover'
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={item => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center mt-20'>
              <Image
                source={icons.logo}
                className='w-12 h-10'
              />
            </View>
            <View className='my-5'>
              <SearchBar
                placeholder='Search movies...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size='large'
                color='#0000ff'
              />
            )}

            {error && (
              <Text className='text-red-500 px-5 my-3'>{error.message}</Text>
            )}

            {!loading && !error && searchQuery.trim() && movies
              ? movies?.length > 0 && (
                  <Text className='text-xl text-white'>
                    Search Results for{' '}
                    <Text className='text-accent'>{searchQuery}</Text>
                  </Text>
                )
              : null}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className='mt-10 px-5'>
              <Text className='text-center text-gray-500'>
                {searchQuery.trim()
                  ? 'No results were found. Try again.'
                  : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;

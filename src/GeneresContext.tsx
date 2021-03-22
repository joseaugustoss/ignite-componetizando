import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "./services/api";

interface GenreResponseProps {
  id: number;
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family";
  title: string;
}

interface MovieProps {
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface GeneresProviderProps {
  children: ReactNode;
}

interface GeneresContextData {
  genres: GenreResponseProps[];
  selectedGenre: GenreResponseProps;
  selectedGenreId: number;
  movies: MovieProps[];
  handleClickButton: (id: number) => void;
}
const GeneresContext = createContext<GeneresContextData>(
  {} as GeneresContextData
);


export function MovieProvider({ children }: GeneresProviderProps) {
  const [selectedGenreId, setSelectedGenreId] = useState(1);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>(
    {} as GenreResponseProps
  );

  useEffect(() => {
    api.get<GenreResponseProps[]>("genres").then((response) => {
      setGenres(response.data);
    });
  }, []);

  useEffect(() => {
    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    api
      .get<GenreResponseProps>(`genres/${selectedGenreId}`)
      .then((response) => {
        setSelectedGenre(response.data);
      });
  }, [selectedGenreId]);

  function handleClickButton(id: number) {
    setSelectedGenreId(id);
  }

  return (
    <GeneresContext.Provider
      value={{
        genres,
        selectedGenreId,
        selectedGenre,
        handleClickButton,
        movies,
      }}
    >
      {children}
    </GeneresContext.Provider>
  );
}
export function useMovie() {
  const context = useContext(GeneresContext);

  return context;
}

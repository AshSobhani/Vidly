import React, { Component } from "react";
import { toast } from "react-toastify";
import { getMovies, deleteMovie } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Pagination from "./common/pagination";
import ListGroup from "./common/listGroup";
import { paginate } from "../utils/paginate";
import MoviesTable from "./moviesTable";
import { Link } from "react-router-dom";
import _ from "lodash";
import SearchBox from "./common/searchBox";

export class Movies extends Component {
	state = {
		movies: [],
		genres: [],
		currentPage: 1,
		pageSize: 4,
		selectedGenre: null,
		searchQuery: "",
		sortColumn: { path: "title", order: "asc" }
	};

	async componentDidMount() {
		const { data: data } = await getGenres();
		const genres = [{ _id: "", name: "All Genres" }, ...data];

		const { data: movies } = await getMovies();
		this.setState({ movies, genres });
	}

	handleGenreSelect = genre => {
		this.setState({
			selectedGenre: genre,
			searchQuery: "",
			currentPage: 1
		});
	};

	handleDelete = async movie => {
		const orginalMovies = this.state.movies;
		const movies = orginalMovies.filter(c => c._id !== movie._id);
		this.setState({ movies });

		try {
			await deleteMovie(movie._id);
		} catch (ex) {
			if (ex.response && ex.response.status === 404) {
				toast.error("This movie has already been deleted");
			}

			this.setState({ movies: orginalMovies });
		}
	};

	handleLike = movie => {
		const movies = [...this.state.movies];
		const index = movies.indexOf(movie);
		movies[index] = { ...movies[index] };
		movies[index].liked = !movies[index].liked;
		this.setState({ movies });
	};

	handlePageChange = page => {
		this.setState({ currentPage: page });
	};

	handleSort = sortColumn => {
		this.setState({ sortColumn });
	};

	handleSearch = query => {
		this.setState({
			searchQuery: query,
			selectedGenre: null,
			currentPage: 1
		});
	};

	getPagedData = () => {
		const {
			pageSize,
			currentPage,
			movies: allMovies,
			selectedGenre,
			searchQuery,
			sortColumn
		} = this.state;

		let filtered = allMovies;

		if (searchQuery) {
			filtered = allMovies.filter(m =>
				m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
			);
		} else if (selectedGenre && selectedGenre._id) {
			filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);
		}

		const sorted = _.orderBy(
			filtered,
			[sortColumn.path],
			[sortColumn.order]
		);

		const movies = paginate(sorted, currentPage, pageSize);

		return { totalCount: filtered.length, data: movies };
	};

	render() {
		const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
		const { totalCount, data: movies } = this.getPagedData();
		const { user } = this.props;

		if (totalCount === 0) {
			return (
				<div>
					<h1>MovieHub</h1>
					<p>No movies have been found in our records</p>
				</div>
			);
		} else {
			return (
				<div className="row">
					<div className="col-3">
						<ListGroup
							items={this.state.genres}
							selectedGenre={this.state.selectedGenre}
							onItemSelect={this.handleGenreSelect}
						/>
					</div>
					<div className="col">
						{user && (
							<Link
								to="/movies/new"
								className="btn btn-primary mb-4"
							>
								New Movie
							</Link>
						)}
						<p>
							A total of {totalCount} movies have been found in
							our records
						</p>
						<SearchBox
							value={searchQuery}
							onChange={this.handleSearch}
						/>
						<MoviesTable
							movies={movies}
							sortColumn={sortColumn}
							onSort={this.handleSort}
							onLike={this.handleLike}
							onDelete={this.handleDelete}
						/>
						<Pagination
							itemsCount={totalCount}
							pageSize={pageSize}
							currentPage={currentPage}
							onPageChange={this.handlePageChange}
						/>
					</div>
				</div>
			);
		}
	}
}

export default Movies;

import { useEffect, useMemo, useState } from 'react';
import { Alert, Badge, Col, Container, Navbar, Nav, Row, Spinner, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import SearchFilters from '../components/SearchFilters';
import { mockMovies } from '../data/mockMovies';
import { movieService } from '../services/movieService';
import type { FilterOptions, Movie } from '../types/movie.types';

const Home = () => {
  const [activeTab, setActiveTab] = useState<'now-showing' | 'coming-soon'>('now-showing');
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadMovies = async () => {
      try {
        const results = await movieService.getAllMovies();
        if (active) {
          setMovies(results);
          setError('');
        }
      } catch {
        if (active) {
          setMovies(mockMovies);
          setError('Unable to load the latest movie list. Showing local data instead.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadMovies();

    return () => {
      active = false;
    };
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (movie.status !== activeTab) return false;

      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        if (!movie.title.toLowerCase().includes(searchLower)) return false;
      }

      if (filters.genre && !movie.genre.includes(filters.genre)) return false;
      if (filters.language && movie.language !== filters.language) return false;
      if (filters.city && !movie.cities.includes(filters.city)) return false;

      return true;
    });
  }, [activeTab, filters, movies]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const nowShowingCount = movies.filter((movie) => movie.status === 'now-showing').length;
  const comingSoonCount = movies.filter((movie) => movie.status === 'coming-soon').length;

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">BookAThing</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Register</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container fluid>
        <div className="text-center mb-5 py-5 bg-light rounded">
          <h1 className="display-4 fw-bold mb-3">Book Your Movie Experience</h1>
          <p className="lead text-muted mb-4">Discover the latest movies, book tickets, and enjoy the show.</p>
        </div>

        <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} onReset={handleResetFilters} />

        {error && (
          <Alert variant="warning" className="mb-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <Tabs activeKey={activeTab} onSelect={(key) => setActiveTab(key as 'now-showing' | 'coming-soon')} className="mb-4">
            <Tab
              eventKey="now-showing"
              title={
                <span>
                  Now Showing <Badge bg="success" className="ms-2">{nowShowingCount}</Badge>
                </span>
              }
            >
              {filteredMovies.length > 0 ? (
                <Row>
                  {filteredMovies.map((movie) => (
                    <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">No movies found matching your filters</h5>
                  <button className="btn btn-outline-primary mt-2" onClick={handleResetFilters}>Reset Filters</button>
                </div>
              )}
            </Tab>

            <Tab
              eventKey="coming-soon"
              title={
                <span>
                  Coming Soon <Badge bg="primary" className="ms-2">{comingSoonCount}</Badge>
                </span>
              }
            >
              {filteredMovies.length > 0 ? (
                <Row>
                  {filteredMovies.map((movie) => (
                    <Col key={movie.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                      <MovieCard movie={movie} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center py-5">
                  <h5 className="text-muted">No movies found matching your filters</h5>
                  <button className="btn btn-outline-primary mt-2" onClick={handleResetFilters}>Reset Filters</button>
                </div>
              )}
            </Tab>
          </Tabs>
        )}
      </Container>
    </>
  );
};

export default Home;

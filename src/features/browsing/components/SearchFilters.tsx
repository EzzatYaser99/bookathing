// SearchFilters component - Similar to Angular Component
// Handles search and filtering of movies

import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import type { FilterOptions } from '../types/movie.types';
import { genres, languages, cities } from '../data/mockMovies';

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, onReset }) => {
  const handleChange = (field: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [field]: value || undefined,
    });
  };

  const handleReset = () => {
    onReset();
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3">Search & Filters</h5>
        <Form>
          <Row>
            {/* Search Query */}
            <Col md={12} lg={3} className="mb-3 mb-lg-0">
              <Form.Group>
                <Form.Label htmlFor="searchQuery">Search Movies</Form.Label>
                <Form.Control
                  id="searchQuery"
                  type="text"
                  placeholder="Search by title..."
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleChange('searchQuery', e.target.value)}
                />
              </Form.Group>
            </Col>

            {/* Genre Filter */}
            <Col md={6} lg={3} className="mb-3 mb-lg-0">
              <Form.Group>
                <Form.Label htmlFor="genre">Genre</Form.Label>
                <Form.Select
                  id="genre"
                  value={filters.genre || ''}
                  onChange={(e) => handleChange('genre', e.target.value)}
                >
                  <option value="">All Genres</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* Language Filter */}
            <Col md={6} lg={3} className="mb-3 mb-lg-0">
              <Form.Group>
                <Form.Label htmlFor="language">Language</Form.Label>
                <Form.Select
                  id="language"
                  value={filters.language || ''}
                  onChange={(e) => handleChange('language', e.target.value)}
                >
                  <option value="">All Languages</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            {/* City Filter */}
            <Col md={12} lg={3} className="mb-0">
              <Form.Group>
                <Form.Label htmlFor="city">City</Form.Label>
                <Form.Select
                  id="city"
                  value={filters.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          {/* Reset Button */}
          <Row className="mt-3">
            <Col className="text-end">
              <Button variant="outline-secondary" onClick={handleReset}>
                Reset Filters
              </Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SearchFilters;

import { Container, Spinner, Alert } from "react-bootstrap";
import { useState } from "react";
import { useResults } from "../../../hooks/useResults";
import ResultsSummary from "./ResultsSummary";
import ResultsList from "./ResultsList";
import ResultsModal from "./ResultsModal";

export default function ResultsView() {
  const { results, loading, error } = useResults();
  const [selected, setSelected] = useState(null);

  if (loading) return <Spinner />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container fluid>
      <ResultsSummary results={results} />
      <ResultsList results={results} onSelect={setSelected} />
      <ResultsModal result={selected} onClose={() => setSelected(null)} />
    </Container>
  );
}

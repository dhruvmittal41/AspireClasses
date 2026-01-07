import { useEffect, useState } from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const ManageTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const res = await api.get("/api/tests");
    setTests(res.data);
    setLoading(false);
  };

  if (loading) return <Spinner />;

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Questions</th>
          <th>Duration</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tests.map((test) => (
          <tr key={test.id}>
            <td>{test.test_name}</td>
            <td>{test.test_category}</td>
            <td>{test.num_questions}</td>
            <td>{test.duration_minutes}</td>
            <td>
              <Button
                size="sm"
                onClick={() => navigate(`/admin/edit/${test._id}`)}
              >
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ManageTests;

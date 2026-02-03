import { useEffect} from "react";
import { Button, Table, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchTests } from "../../features/data/testsSlice";


const ManageTests = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();

const { testsList, loading } = useSelector(
  (state) => state.tests
);

useEffect(() => {
  dispatch(fetchTests());
}, [dispatch]);


  useEffect(() => {
    fetchTests();
  }, []);


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
  {testsList.map((test) => (
    <tr key={test.id}>
      <td>{test.test_name}</td>
      <td>{test.test_category}</td>
      <td>{test.num_questions}</td>
      <td>{test.duration_minutes}</td>
      <td>
        <Button
          size="sm"
          onClick={() => navigate(`/admin/edit/${test.id}`)}
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

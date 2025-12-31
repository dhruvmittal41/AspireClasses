import React from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Button } from "react-bootstrap";

const ProfileForm = ({ data, errors, onChange, onSubmit }) => {
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    onChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Form noValidate onSubmit={onSubmit}>
      <Row className="g-3">
        <Col sm={6}>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={data.full_name || ""}
              onChange={handleFieldChange}
              isInvalid={!!errors.full_name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.full_name}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email_or_phone"
              value={data.email_or_phone || ""}
              disabled
              readOnly
            />
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>School Name</Form.Label>
            <Form.Control
              type="text"
              name="school_name"
              value={data.school_name || ""}
              onChange={handleFieldChange}
            />
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              name="mobile_number"
              value={data.mobile_number || ""}
              onChange={handleFieldChange}
              isInvalid={!!errors.mobile_number}
            />
            <Form.Control.Feedback type="invalid">
              {errors.mobile_number}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              name="dob"
              value={data.dob || ""}
              onChange={handleFieldChange}
              isInvalid={!!errors.dob}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dob}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col sm={6}>
          <Form.Group>
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={data.gender || ""}
              onChange={handleFieldChange}
              isInvalid={!!errors.gender}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.gender}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col sm={4}>
          <Form.Group>
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              name="city"
              value={data.city || ""}
              onChange={handleFieldChange}
              isInvalid={!!errors.city}
            />
            <Form.Control.Feedback type="invalid">
              {errors.city}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col sm={4}>
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              name="state"
              value={data.state || ""}
              onChange={handleFieldChange}
              isInvalid={!!errors.state}
            />
            <Form.Control.Feedback type="invalid">
              {errors.state}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col sm={4}>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={data.country || ""}
              onChange={handleFieldChange}
              isInvalid={!!errors.country}
            />
            <Form.Control.Feedback type="invalid">
              {errors.country}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" className="mt-4 float-end">
        Save Changes
      </Button>
    </Form>
  );
};

ProfileForm.propTypes = {
  data: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ProfileForm;

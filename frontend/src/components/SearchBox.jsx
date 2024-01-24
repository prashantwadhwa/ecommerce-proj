import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
        setKeyword('')
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="mx-4">
      <Form onSubmit={submitHandler} className="d-flex">
        <Form.Control
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search Products..."
          value={keyword}
          className="me-sm-2 ms-sm-5"
        ></Form.Control>
        <Button type="submit" className="search-btn p-2">
          <FaSearch />
        </Button>
      </Form>
    </div>
  );
};

export default SearchBox;

import React from "react";
import { Route, Link } from "react-router-dom";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import AuthError from "./AuthError";

import { VAlign } from "styles/commons";
import SupplierResource from "resources/supplier";
import { useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  FormGroup,
  FormInput,
  ListGroupItem,
  ListGroup,
  Form,
  FormFeedback
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import AuthorizedView from "../components/AuthorizedView";

const ListActions = ({ supplier }) => {
  const del = useFetcher(SupplierResource.deleteShape());
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      del(undefined, { id: supplier.id });
    }
  };

  const handleBlur = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
  };

  if (!supplier) {
    return null;
  }

  return (
    <>
      <AuthorizedView permissionType="edit-supplier">
        <Link to={`/supplier/edit/${supplier.id}`}>
          <Button
            type="submit"
            size="sm"
            outline
            theme="secondary"
            className="mr-2"
          >
            <i className="material-icons">edit</i>
          </Button>
        </Link>
      </AuthorizedView>

      <AuthorizedView permissionType="delete-supplier">
        <Button
          type="submit"
          size="sm"
          outline
          onClick={handleDelete}
          onBlur={handleBlur}
          theme={confirmDelete ? "danger" : "warning"}
        >
          <i className="material-icons">delete</i>
        </Button>
      </AuthorizedView>
    </>
  );
};

const SupplierList = () => {
  const [query, setQuery] = React.useState("");
  const supplierList = useResource(SupplierResource.listShape(), {});

  const onSearch = e => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Supplier"
          subtitle="Daftar Supplier"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col lg="4">
                  <VAlign>
                    <FormInput
                      id="feQuery"
                      name="query"
                      placeholder="Cari"
                      onChange={onSearch}
                      value={query}
                    />
                  </VAlign>
                </Col>

                <Col lg={{ offset: 6, size: 2 }}>
                  <AuthorizedView permissionType="add-supplier">
                    <Link to="/supplier/add">
                      <Button block size="sm" theme="primary">
                        Tambah Supplier
                      </Button>
                    </Link>
                  </AuthorizedView>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    <th scope="col" className="border-0">
                      ID
                    </th>
                    <th scope="col" className="border-0">
                      Nama
                    </th>
                    <th scope="col" className="border-0">
                      Alamat
                    </th>
                    <th scope="col" className="border-0">
                      Nomor Telepon
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {supplierList
                    .filter(supplier =>
                      supplier.name.toLowerCase().includes(query)
                    )
                    .map(supplier => (
                      <tr key={supplier.id}>
                        <td>{supplier.id}</td>
                        <td>{supplier.name}</td>
                        <td>{supplier.address}</td>
                        <td>{supplier.phoneNo}</td>
                        <React.Suspense>
                          <td className="d-flex justify-content-center">
                            <ListActions supplier={supplier} />
                          </td>
                        </React.Suspense>
                      </tr>
                    ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const SupplierAdd = props => {
  const createSupplier = useFetcher(SupplierResource.createShape());
  const history = useHistory();
  const { handleSubmit, register, errors } = useForm();
  const invalidateSupplierList = useInvalidator(
    SupplierResource.listShape(),
    {}
  );

  const onSubmit = (values, e) => {
    createSupplier(values, {});
    invalidateSupplierList({});

    history.push("/supplier");
  };

  return (
    <AuthorizedView permissionType="add-supplier" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Supplier"
          subtitle="Tambah Supplier"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Tambah Supplier</h6>
                  </VAlign>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="feName">Nama</label>
                            <FormInput
                              id="feName"
                              name="name"
                              placeholder="Nama"
                              invalid={!!errors.name}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 2,
                                  message: "Minimal 2 karakter"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.name}>
                              {errors.name && errors.name.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6">
                            <label htmlFor="fePhoneNo">No. Handphone</label>
                            <FormInput
                              name="phoneNo"
                              id="fePhoneNo"
                              placeholder="08123456789"
                              invalid={!!errors.phoneNo}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 2,
                                  message: "Minimal 2 karakter"
                                },
                                pattern: {
                                  value: /^[0-9-]*$/,
                                  message: "Hanya angka dan karakter: -"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.phoneNo}>
                              {errors.phoneNo && errors.phoneNo.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <FormGroup>
                          <label htmlFor="feAddress">Alamat</label>
                          <FormInput
                            id="feAddress"
                            placeholder="Jl. 1234 Jatikramat"
                            name="address"
                            invalid={!!errors.address}
                            innerRef={register({
                              required: "Wajib diisi",
                              minLength: {
                                value: 2,
                                message: "Minimal 2 karakter"
                              }
                            })}
                          />
                          <FormFeedback invalid={!!errors.address}>
                            {errors.address && errors.address.message}
                          </FormFeedback>
                        </FormGroup>
                        <Button type="submit">Tambah Supplier Baru</Button>
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </AuthorizedView>
  );
};

const SupplierEdit = props => {
  const supplier = useResource(SupplierResource.detailShape(), {
    id: props.match.params.supplierId
  });
  const updateSupplier = useFetcher(SupplierResource.updateShape());

  const { handleSubmit, register, errors } = useForm({
    defaultValues: {
      name: supplier.name,
      phoneNo: supplier.phoneNo,
      address: supplier.address
    }
  });
  // const invalidateSupplierList = useInvalidator(SupplierResource.listShape(), {});

  const onSubmit = (values, e) => {
    updateSupplier(values, { id: props.match.params.supplierId });
    // invalidateSupplierList({});

    props.history.push("/supplier");
  };

  return (
    <AuthorizedView permissionType="edit-supplier" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Supplier"
          subtitle="Ubah Supplier"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Ubah Supplier</h6>
                  </VAlign>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row>
                    <Col>
                      <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="feName">Nama</label>
                            <FormInput
                              id="feName"
                              name="name"
                              placeholder="Nama"
                              invalid={!!errors.name}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 2,
                                  message: "Minimal 2 karakter"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.name}>
                              {errors.name && errors.name.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6">
                            <label htmlFor="fePhoneNo">No. Handphone</label>
                            <FormInput
                              name="phoneNo"
                              id="fePhoneNo"
                              placeholder="08123456789"
                              invalid={!!errors.phoneNo}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 2,
                                  message: "Minimal 2 karakter"
                                },
                                pattern: {
                                  value: /^[0-9-]*$/,
                                  message: "Hanya angka dan karakter: -"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.phoneNo}>
                              {errors.phoneNo && errors.phoneNo.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <FormGroup>
                          <label htmlFor="feAddress">Alamat</label>
                          <FormInput
                            id="feAddress"
                            placeholder="Jl. 1234 Jatikramat"
                            name="address"
                            invalid={!!errors.address}
                            innerRef={register({
                              required: "Wajib diisi",
                              minLength: {
                                value: 2,
                                message: "Minimal 2 karakter"
                              }
                            })}
                          />
                          <FormFeedback invalid={!!errors.address}>
                            {errors.address && errors.address.message}
                          </FormFeedback>
                        </FormGroup>
                        <Button type="submit">Ubah Supplier</Button>
                      </Form>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </AuthorizedView>
  );
};

const Supplier = () => {
  return (
    <AuthorizedView permissionType="read-supplier" fallback={<AuthError />}>
      <Container fluid className="main-content-container px-4">
        <Route exact path="/supplier" component={SupplierList} />
        <Route path="/supplier/add" component={SupplierAdd} />
        <Route path="/supplier/edit/:supplierId" component={SupplierEdit} />
      </Container>
    </AuthorizedView>
  );
};

export default Supplier;

import React from "react";
import { Route, Link } from "react-router-dom";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import AuthError from "./AuthError";

import { VAlign } from "styles/commons";
import OutletResource from "resources/outlet";
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

const ListActions = ({ outlet }) => {
  const del = useFetcher(OutletResource.deleteShape());
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      del(undefined, { id: outlet.id });
    }
  };

  const handleBlur = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
  };

  if (!outlet || outlet.id === 1) {
    return null;
  }

  return (
    <>
      <AuthorizedView permissionType="edit-outlet">
        <Link to={`/outlet/edit/${outlet.id}`}>
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

      <AuthorizedView permissionType="delete-outlet">
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

const OutletList = () => {
  const [query, setQuery] = React.useState("");
  const OutletList = useResource(OutletResource.listShape(), {});

  const onSearch = e => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Outlet"
          subtitle="Daftar Outlet"
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
                  <AuthorizedView permissionType="add-outlet">
                    <Link to="/outlet/add">
                      <Button block size="sm" theme="primary">
                        Tambah Outlet
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
                  {OutletList.filter(outlet =>
                    outlet.name.toLowerCase().includes(query)
                  ).map(outlet => (
                    <tr key={outlet.id}>
                      <td>{outlet.id}</td>
                      <td>{outlet.name}</td>
                      <td>{outlet.address}</td>
                      <td>{outlet.phoneNo}</td>
                      <React.Suspense>
                        <td className="d-flex justify-content-center">
                          <ListActions outlet={outlet} />
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

const OutletAdd = props => {
  const createOutlet = useFetcher(OutletResource.createShape());
  const history = useHistory();
  const { handleSubmit, register, errors } = useForm();
  const invalidateOutletList = useInvalidator(OutletResource.listShape(), {});

  const onSubmit = (values, e) => {
    createOutlet(values, {});
    invalidateOutletList({});

    history.push("/outlet");
  };

  return (
    <AuthorizedView permissionType="add-outlet" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Outlet"
          subtitle="Tambah Outlet"
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
                    <h6 className="m-0">Tambah Outlet</h6>
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
                        <Button type="submit">Tambah Outlet Baru</Button>
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

const OutletEdit = props => {
  const outlet = useResource(OutletResource.detailShape(), {
    id: props.match.params.outletId
  });
  const updateOutlet = useFetcher(OutletResource.updateShape());

  const { handleSubmit, register, errors } = useForm({
    defaultValues: {
      name: outlet.name,
      phoneNo: outlet.phoneNo,
      address: outlet.address
    }
  });
  // const invalidateOutletList = useInvalidator(OutletResource.listShape(), {});

  const onSubmit = (values, e) => {
    updateOutlet(values, { id: props.match.params.outletId });
    // invalidateOutletList({});

    props.history.push("/outlet");
  };

  return (
    <AuthorizedView permissionType="edit-outlet" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Outlet"
          subtitle="Ubah Outlet"
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
                    <h6 className="m-0">Ubah Outlet</h6>
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
                        <Button type="submit">Ubah Outlet</Button>
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

const Outlet = () => {
  return (
    <AuthorizedView permissionType="read-outlet" fallback={<AuthError />}>
      <Container fluid className="main-content-container px-4">
        <Route exact path="/outlet" component={OutletList} />
        <Route path="/outlet/add" component={OutletAdd} />
        <Route path="/outlet/edit/:outletId" component={OutletEdit} />
      </Container>
    </AuthorizedView>
  );
};

export default Outlet;

import React from "react";
import { Route, Link } from "react-router-dom";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import AuthError from "./AuthError";

import { VAlign } from "styles/commons";
import DoctorResource from "resources/doctor";
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

const ListActions = ({ doctor }) => {
  const del = useFetcher(DoctorResource.deleteShape());
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      del(undefined, { id: doctor.id });
    }
  };

  const handleBlur = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
  };

  if (!doctor) {
    return null;
  }

  return (
    <>
      <AuthorizedView permissionType="edit-doctor">
        <Link to={`/dokter/edit/${doctor.id}`}>
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

      <AuthorizedView permissionType="delete-doctor">
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

const DoctorList = () => {
  const [query, setQuery] = React.useState("");
  const doctorList = useResource(DoctorResource.listShape(), {});

  const onSearch = e => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Dokter"
          subtitle="Daftar Dokter"
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
                  <AuthorizedView permissionType="add-doctor">
                    <Link to="/dokter/add">
                      <Button block size="sm" theme="primary">
                        Tambah Dokter
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
                  {doctorList
                    .filter(doctor => doctor.name.toLowerCase().includes(query))
                    .map(doctor => (
                      <tr key={doctor.id}>
                        <td>{doctor.id}</td>
                        <td>{doctor.name}</td>
                        <td>{doctor.address}</td>
                        <td>{doctor.phoneNo}</td>
                        <React.Suspense>
                          <td className="d-flex justify-content-center">
                            <ListActions doctor={doctor} />
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

const DoctorAdd = props => {
  const createDoctor = useFetcher(DoctorResource.createShape());
  const history = useHistory();
  const { handleSubmit, register, errors } = useForm();
  const invalidateDoctorList = useInvalidator(DoctorResource.listShape(), {});

  const onSubmit = (values, e) => {
    createDoctor(values, {});
    invalidateDoctorList({});

    history.push("/dokter");
  };

  return (
    <AuthorizedView permissionType="add-doctor" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Dokter"
          subtitle="Tambah Dokter"
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
                    <h6 className="m-0">Tambah Dokter</h6>
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
                        <Button type="submit">Tambah Dokter Baru</Button>
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

const DoctorEdit = props => {
  const doctor = useResource(DoctorResource.detailShape(), {
    id: props.match.params.doctorId
  });
  const updateDoctor = useFetcher(DoctorResource.updateShape());

  const { handleSubmit, register, errors } = useForm({
    defaultValues: {
      name: doctor.name,
      phoneNo: doctor.phoneNo,
      address: doctor.address
    }
  });
  // const invalidateDoctorList = useInvalidator(DoctorResource.listShape(), {});

  const onSubmit = (values, e) => {
    updateDoctor(values, { id: props.match.params.doctorId });
    // invalidateDoctorList({});

    props.history.push("/dokter");
  };

  return (
    <AuthorizedView permissionType="edit-doctor" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Dokter"
          subtitle="Ubah Dokter"
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
                    <h6 className="m-0">Ubah Dokter</h6>
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
                        <Button type="submit">Ubah Dokter</Button>
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

const Doctor = () => {
  return (
    <AuthorizedView permissionType="view-doctor">
      <Container fluid className="main-content-container px-4">
        <Route exact path="/dokter" component={DoctorList} />
        <Route path="/dokter/add" component={DoctorAdd} />
        <Route path="/dokter/edit/:doctorId" component={DoctorEdit} />
      </Container>
    </AuthorizedView>
  );
};

export default Doctor;

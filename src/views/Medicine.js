import React from "react";
import { Route, Link } from "react-router-dom";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import AuthError from "./AuthError";

import { VAlign } from "styles/commons";
import MedicineResource from "resources/medicine";
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

const ListActions = ({ medicine }) => {
  const del = useFetcher(MedicineResource.deleteShape());
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      del(undefined, { id: medicine.id });
    }
  };

  const handleBlur = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
  };

  if (!medicine) {
    return null;
  }

  return (
    <>
      <AuthorizedView permissionType="write-medicine">
        <Link to={`/obat/edit/${medicine.id}`}>
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

      <AuthorizedView permissionType="delete-medicine">
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

const MedicineList = () => {
  const [query, setQuery] = React.useState("");
  const medicineList = useResource(MedicineResource.listShape(), {});

  const onSearch = e => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Obat"
          subtitle="Daftar Obat"
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
                  <AuthorizedView permissionType="write-medicine">
                    <Link to="/obat/add">
                      <Button block size="sm" theme="primary">
                        Tambah Obat
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
                      Harga
                    </th>
                    <th scope="col" className="border-0">
                      Jenis Obat
                    </th>
                    <th scope="col" className="border-0">
                      Pabrik
                    </th>
                    <th scope="col" className="border-0">
                      Stok
                    </th>
                    <th scope="col" className="border-0">
                      Satuan
                    </th>
                    <th scope="col" className="border-0">
                      Minimal Stok
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medicineList
                    .filter(medicine =>
                      medicine.name.toLowerCase().includes(query)
                    )
                    .map(medicine => (
                      <tr key={medicine.id}>
                        <td>{medicine.id}</td>
                        <td>{medicine.name}</td>
                        <td>{medicine.price}</td>
                        <td>{medicine.medsCategory.data.name}</td>
                        <td>{medicine.factory}</td>
                        <td>{medicine.currStock}</td>
                        <td>{medicine.medsType.data.name}</td>
                        <td>{medicine.minStock}</td>
                        <React.Suspense>
                          <td className="d-flex justify-content-center">
                            <ListActions medicine={medicine} />
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

const MedicineAdd = props => {
  const createMedicine = useFetcher(MedicineResource.createShape());
  const history = useHistory();
  const { handleSubmit, register, errors } = useForm();
  const invalidateMedicineList = useInvalidator(
    MedicineResource.listShape(),
    {}
  );

  const onSubmit = (values, e) => {
    createMedicine(values, {});
    invalidateMedicineList({});

    history.push("/obat");
  };

  return (
    <AuthorizedView permissionType="write-medicine" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Obat"
          subtitle="Tambah Obat"
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
                    <h6 className="m-0">Tambah Obat</h6>
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
                        <Button type="submit">Tambah Obat Baru</Button>
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

const MedicineEdit = props => {
  const medicine = useResource(MedicineResource.detailShape(), {
    id: props.match.params.medicineId
  });
  const updateMedicine = useFetcher(MedicineResource.updateShape());

  const { handleSubmit, register, errors } = useForm({
    defaultValues: {
      name: medicine.name,
      phoneNo: medicine.phoneNo,
      address: medicine.address
    }
  });
  // const invalidateMedicineList = useInvalidator(MedicineResource.listShape(), {});

  const onSubmit = (values, e) => {
    updateMedicine(values, { id: props.match.params.medicineId });
    // invalidateMedicineList({});

    props.history.push("/obat");
  };

  return (
    <AuthorizedView permissionType="write-medicine" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle title="Obat" subtitle="Ubah Obat" className="text-sm-left" />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Ubah Obat</h6>
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
                        <Button type="submit">Ubah Obat</Button>
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

const Medicine = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Route exact path="/obat" component={MedicineList} />
      <Route path="/obat/add" component={MedicineAdd} />
      <Route path="/obat/edit/:medicineId" component={MedicineEdit} />
    </Container>
  );
};

export default Medicine;

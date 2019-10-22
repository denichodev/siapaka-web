import React from "react";
import { Route, Link } from "react-router-dom";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import AuthError from "./AuthError";

import { VAlign } from "styles/commons";
import MedicineResource from "resources/medicine";
import MedsTypeResource from "resources/medsType";
import MedsCategoryResource from "resources/medsCategory";
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
  FormFeedback,
  FormSelect
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
  const medicineList = useResource(MedicineResource.minimalListShape(), {});
  const onSearch = e => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle title="Pengadaan" className="text-sm-left" />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col lg="4">
                  <VAlign>
                    <h6 className="m-0">Obat dengan Stok Minimal</h6>
                  </VAlign>
                </Col>

                <Col lg={{ offset: 4, size: 4 }}>
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
  const medsTypeList = useResource(MedsTypeResource.listShape(), {});
  const medsCategoryList = useResource(MedsCategoryResource.listShape(), {});
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
                          <Col md="12" className="form-group">
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
                        </Row>

                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="fePrice">Harga</label>
                            <FormInput
                              id="fePrice"
                              name="price"
                              placeholder="Harga"
                              invalid={!!errors.price}
                              innerRef={register({
                                required: "Wajib diisi",
                                pattern: {
                                  value: /^\d+$/,
                                  message: "Hanya angka"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.price}>
                              {errors.price && errors.price.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="feMedsCategory">Jenis</label>
                            <FormSelect
                              id="feMedsCategory"
                              name="medsCategoryId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {medsCategoryList.map(medsCategory => (
                                <option
                                  value={medsCategory.id}
                                  key={medsCategory.id}
                                >
                                  {medsCategory.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.medsCategoryId}>
                              {errors.medsCategoryId &&
                                errors.medsCategoryId.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <Row form>
                          <Col md="4" className="form-group">
                            <label htmlFor="feCurrStock">Stok</label>
                            <FormInput
                              id="feCurrStock"
                              name="currStock"
                              placeholder="Stok"
                              invalid={!!errors.currStock}
                              innerRef={register({
                                required: "Wajib diisi",
                                pattern: {
                                  value: /^\d+$/,
                                  message: "Hanya angka"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.currStock}>
                              {errors.currStock && errors.currStock.message}
                            </FormFeedback>
                          </Col>
                          <Col md="4" className="form-group">
                            <label htmlFor="feMedsType">Satuan</label>
                            <FormSelect
                              id="feMedsType"
                              name="medsTypeId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {medsTypeList.map(medsType => (
                                <option value={medsType.id} key={medsType.id}>
                                  {medsType.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.medsTypeId}>
                              {errors.medsTypeId && errors.medsTypeId.message}
                            </FormFeedback>
                          </Col>
                          <Col md="4" className="form-group">
                            <label htmlFor="feMinStock">Stok Minimal</label>
                            <FormInput
                              id="feMinStock"
                              name="minStock"
                              placeholder="Stok Minimal"
                              invalid={!!errors.minStock}
                              innerRef={register({
                                required: "Wajib diisi",
                                pattern: {
                                  value: /^\d+$/,
                                  message: "Hanya angka"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.minStock}>
                              {errors.minStock && errors.minStock.message}
                            </FormFeedback>
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="12" className="form-group">
                            <label htmlFor="feFactory">Pabrik</label>
                            <FormInput
                              id="feFactory"
                              name="factory"
                              placeholder="Pabrik"
                              invalid={!!errors.factory}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 2,
                                  message: "Minimal 2 karakter"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.factory}>
                              {errors.factory && errors.factory.message}
                            </FormFeedback>
                          </Col>
                        </Row>
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
  const medsTypeList = useResource(MedsTypeResource.listShape(), {});
  const medsCategoryList = useResource(MedsCategoryResource.listShape(), {});
  const medicine = useResource(MedicineResource.detailShape(), {
    id: props.match.params.medicineId
  });
  const updateMedicine = useFetcher(MedicineResource.updateShape());

  const { handleSubmit, register, errors } = useForm({
    defaultValues: {
      name: medicine.name,
      price: Number(medicine.price),
      factory: medicine.factory,
      currStock: medicine.currStock,
      minStock: medicine.minStock,
      medsTypeId: medicine.medsType.data.id,
      medsCategoryId: medicine.medsCategory.data.id
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
                          <Col md="12" className="form-group">
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
                        </Row>

                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="fePrice">Harga</label>
                            <FormInput
                              id="fePrice"
                              name="price"
                              placeholder="Harga"
                              invalid={!!errors.price}
                              innerRef={register({
                                required: "Wajib diisi",
                                pattern: {
                                  value: /^\d+$/,
                                  message: "Hanya angka"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.price}>
                              {errors.price && errors.price.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="feMedsCategory">Jenis</label>
                            <FormSelect
                              id="feMedsCategory"
                              name="medsCategoryId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {medsCategoryList.map(medsCategory => (
                                <option
                                  value={medsCategory.id}
                                  key={medsCategory.id}
                                >
                                  {medsCategory.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.medsCategoryId}>
                              {errors.medsCategoryId &&
                                errors.medsCategoryId.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <Row form>
                          <Col md="4" className="form-group">
                            <label htmlFor="feCurrStock">Stok</label>
                            <FormInput
                              id="feCurrStock"
                              name="currStock"
                              placeholder="Stok"
                              invalid={!!errors.currStock}
                              innerRef={register({
                                required: "Wajib diisi",
                                pattern: {
                                  value: /^\d+$/,
                                  message: "Hanya angka"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.currStock}>
                              {errors.currStock && errors.currStock.message}
                            </FormFeedback>
                          </Col>
                          <Col md="4" className="form-group">
                            <label htmlFor="feMedsType">Satuan</label>
                            <FormSelect
                              id="feMedsType"
                              name="medsTypeId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {medsTypeList.map(medsType => (
                                <option value={medsType.id} key={medsType.id}>
                                  {medsType.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.medsTypeId}>
                              {errors.medsTypeId && errors.medsTypeId.message}
                            </FormFeedback>
                          </Col>
                          <Col md="4" className="form-group">
                            <label htmlFor="feMinStock">Stok Minimal</label>
                            <FormInput
                              id="feMinStock"
                              name="minStock"
                              placeholder="Stok Minimal"
                              invalid={!!errors.minStock}
                              innerRef={register({
                                required: "Wajib diisi",
                                pattern: {
                                  value: /^\d+$/,
                                  message: "Hanya angka"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.minStock}>
                              {errors.minStock && errors.minStock.message}
                            </FormFeedback>
                          </Col>
                        </Row>
                        <Row form>
                          <Col md="12" className="form-group">
                            <label htmlFor="feFactory">Pabrik</label>
                            <FormInput
                              id="feFactory"
                              name="factory"
                              placeholder="Pabrik"
                              invalid={!!errors.factory}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 2,
                                  message: "Minimal 2 karakter"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.factory}>
                              {errors.factory && errors.factory.message}
                            </FormFeedback>
                          </Col>
                        </Row>
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

const Procurement = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Route exact path="/pengadaan" component={MedicineList} />
      <Route path="/pengadaan/add" component={MedicineAdd} />
      <Route path="/pengadaan/edit/:medicineId" component={MedicineEdit} />
    </Container>
  );
};

export default Procurement;

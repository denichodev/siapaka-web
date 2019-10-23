import React from "react";
import { Route, Link } from "react-router-dom";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import UserContext from "contexts/UserContext";
import AuthError from "./AuthError";
import dayjs from "dayjs";

import { VAlign } from "styles/commons";
import ProcurementResource from "resources/procurement";
import MedicineResource from "resources/medicine";
import MedsTypeResource from "resources/medsType";
import SupplierResource from "resources/supplier";
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
  FormInput,
  ListGroupItem,
  ListGroup,
  Form,
  FormFeedback,
  FormSelect
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import AuthorizedView from "../components/AuthorizedView";

const DatePickerWrapper = styled.div`
  input {
    height: calc(2.09375rem + 2px);
    padding: 0.375rem 1.75rem 0.375rem 0.75rem;
    line-height: 1.5;
    color: #495057;
    background: #fff
      url(data:image/svg+xml;charset=utf8,%3Csvg xmlns=http://www.w3.org/2000/svg v…0 0 4 5%3E%3Cpath fill=%23333 d=M2 0L0 2h4zm0 5L0 3h4z/%3E%3C/svg%3E)
      no-repeat right 0.75rem center;
    background-size: 8px 10px;
    border: 1px solid #e1e5eb;
    font-weight: 300;
    font-size: 0.8125rem;
    transition: box-shadow 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06),
      border 250ms cubic-bezier(0.27, 0.01, 0.38, 1.06);
    border-radius: 0.25rem;
  }
  height: 100%;
`;

const QtyInput = styled(FormInput)`
  width: 60px;
`;

const ListActions = ({ procurement }) => {
  const del = useFetcher(ProcurementResource.deleteShape());
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      del(undefined, { id: procurement.id });
    }
  };

  const handleBlur = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
  };

  if (!procurement || procurement.status !== "PROCESS") {
    return null;
  }

  return (
    <>
      <div className="mr-2">
        <AuthorizedView permissionType="delete-procurement">
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
      </div>
      <AuthorizedView permissionType="read-procurement">
        <Link to={`/pengadaan/${procurement.id}`}>
          <Button
            type="submit"
            size="sm"
            outline
            onClick={() => {}}
            theme="info"
          >
            <i className="material-icons">visibility</i>
          </Button>
        </Link>
      </AuthorizedView>
    </>
  );
};

const ProcurementList = () => {
  const [query, setQuery] = React.useState("");
  const minimalMedicineList = useResource(
    MedicineResource.minimalListShape(),
    {}
  );
  const procurementList = useResource(ProcurementResource.listShape(), {});
  const onSearch = e => {
    setQuery(e.target.value);
  };
  const userState = React.useContext(UserContext);
  const userRole = userState.me.role_id;

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title={userRole === "APT" ? "Rekapitulasi Pengadaan" : "Pengadaan"}
          className="text-sm-left"
        />
      </Row>

      {/* procs */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col lg="4">
                  <VAlign>
                    <h6 className="m-0">Daftar Status Pengadaan</h6>
                  </VAlign>
                </Col>

                <Col lg={{ offset: userRole === "APT" ? 4 : 2, size: 4 }}>
                  <VAlign>
                    <FormInput
                      id="feQuery"
                      name="query"
                      placeholder="Cari berdasarkan supplier"
                      onChange={onSearch}
                      value={query}
                    />
                  </VAlign>
                </Col>
                <Col lg={{ size: 2 }}>
                  <AuthorizedView permissionType="add-procurement">
                    <Link to="/pengadaan/add">
                      <Button block size="sm" theme="primary">
                        Tambah Pengadaan
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
                      Supplier
                    </th>
                    <th scope="col" className="border-0">
                      Staff
                    </th>
                    <th scope="col" className="border-0">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {procurementList
                    .filter(procurement =>
                      procurement.supplier.data.name
                        .toLowerCase()
                        .includes(query)
                    )
                    .map(procurement => (
                      <tr key={procurement.id}>
                        <td>{procurement.id}</td>
                        <td>{procurement.supplier.data.name}</td>
                        <td>{procurement.staff.data.name}</td>
                        <td>{procurement.status}</td>
                        <React.Suspense>
                          <td className="d-flex justify-content-center">
                            <ListActions procurement={procurement} />
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

      {/* min meds */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col lg="4">
                  <VAlign>
                    <h6 className="m-0">Obat Dengan Stok Minimal</h6>
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
                      Jenis Pengadaan
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
                  {minimalMedicineList
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

const createMedicinesFromAPI = (meds, uMeds) => {
  const verifiedMeds = meds.map(m => ({
    ...m.medicine.data,
    qty: m.qty,
    qtytype: m.qtyType
  }));

  const unverifiedMeds = uMeds.map(m => ({
    ...m,
    id: `${m.id} (baru)`
  }));

  return unverifiedMeds.concat(verifiedMeds);
};

const ProcurementDetail = props => {
  const procurement = useResource(ProcurementResource.detailShape(), {
    id: props.match.params.procurementId
  });
  const [fakeIdCounter, setFakeIdCounter] = React.useState(1);

  const userState = React.useContext(UserContext);
  const userRole = userState.me.role_id;

  // Adding meds
  const [medicines, setMedicines] = React.useState(
    createMedicinesFromAPI(
      procurement.medicines.data,
      procurement.unverifiedMedicines.data
    )
  );
  const minimalMedicineList = useResource(
    MedicineResource.minimalListShape(),
    {}
  );
  const addMedicine = (med, qty, qtyType) => {
    const medToAdd = {
      ...med,
      qty,
      qtyType
    };
    setMedicines([...medicines.filter(m => m.id !== med.id), medToAdd]);
  };

  console.log(medicines);

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title={userRole === "APT" ? "Detail Pengadaan" : "Pengadaan"}
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
                    <h6 className="m-0">Detail</h6>
                  </VAlign>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <Row className="pl-3 pr-3 pb-3">
                    Nomor Transaksi: {procurement.id}
                  </Row>
                  <Row className="pl-3 pr-3 pb-3">
                    Status: {procurement.status}
                  </Row>
                  <Row className="pl-3 pr-3 pb-3">
                    {procurement.supplier.data.name}
                  </Row>
                  <Row className="pl-3 pr-3 pb-3">
                    {procurement.supplier.data.address}
                  </Row>
                  <Row className="pl-3 pr-3 pb-3">
                    {dayjs(procurement.orderDate).format("DD/MM/YYYY")}
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* procs */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col lg="4">
                  <VAlign>
                    <h6 className="m-0">Daftar Obat</h6>
                  </VAlign>
                </Col>

                <Col lg={{ size: 2 }}>
                  <AuthorizedView permissionType="add-procurement">
                    <Link to="/pengadaan/add">
                      <Button block size="sm" theme="primary">
                        Tambah Pengadaan
                      </Button>
                    </Link>
                  </AuthorizedView>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <div className="p-0 pb-4">
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
                        Satuan
                      </th>
                      <th scope="col" className="border-0">
                        Jumlah Pengadaan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicines.map((med, index) => (
                      <tr key={med.id}>
                        <td>{med.id}</td>
                        <td>{med.name}</td>
                        <td>{med.price}</td>
                        <td>{med.medsCategory.data.name}</td>
                        <td>{med.factory}</td>
                        <td>{med.medsType.data.name}</td>
                        <td>{`${med.qty} ${
                          med.qtyType === "BOX" ? "Dus" : "Karton"
                        }`}</td>
                        <td className="d-flex justify-content-center">
                          <Button
                            type="button"
                            size="sm"
                            outline
                            theme="danger"
                            onClick={() => {
                              setMedicines(
                                medicines.filter(m => m.id !== med.id)
                              );
                            }}
                          >
                            <i className="material-icons">delete</i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Obat Minimal</h6>
                  </VAlign>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <div className="p-0 pb-3">
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
                        Min. Stok
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {minimalMedicineList.map(medicine => (
                      <MinMedRow medicine={medicine} onAdd={addMedicine} />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Tambah Obat Baru</h6>
                  </VAlign>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <NewMedForm
                    onSubmit={(values, qty, qtyType) => {
                      const medToAdd = {
                        ...values,
                        id: `(baru-${fakeIdCounter})`,
                        medsCategory: {
                          data: {
                            id: values.medsCategoryId,
                            name: medsCategoryMap[values.medsCategoryId]
                          }
                        },
                        medsType: {
                          data: {
                            id: values.medsTypeId,
                            name: medsTypeMap[values.medsTypeId]
                          }
                        }
                      };
                      setFakeIdCounter(prev => (prev += 1));
                      addMedicine(medToAdd, qty, qtyType);
                    }}
                  />
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const MinMedRow = ({ medicine, onAdd }) => {
  const [qty, setQty] = React.useState(1);
  const [qtyType, setQtyType] = React.useState("BOX");

  return (
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
          <div className="mr-2">
            <QtyInput
              type="number"
              min="1"
              id="feQty"
              name="qty"
              size="sm"
              placeholder="qty"
              value={qty}
              onChange={e => {
                if (e.target.value.length) {
                  setQty(e.target.value);
                } else {
                  setQty(1);
                }
              }}
            />
          </div>
          <div className="mr-2">
            <FormSelect
              id="feQtyType"
              name="qtyType"
              size="sm"
              placeholder="Satuan"
              value={qtyType}
              onChange={e => setQtyType(e.target.value)}
            >
              <option value="BOX">Dus</option>
              <option value="CARTON">Karton</option>
            </FormSelect>
          </div>
          <Button
            type="button"
            size="sm"
            outline
            theme="secondary"
            className="mr-2"
            onClick={() => onAdd(medicine, qty, qtyType)}
          >
            <i className="material-icons">add</i>
          </Button>
        </td>
      </React.Suspense>
    </tr>
  );
};

const NewMedForm = props => {
  const medsTypeList = useResource(MedsTypeResource.listShape(), {});
  const medsCategoryList = useResource(MedsCategoryResource.listShape(), {});
  const { handleSubmit, register, errors, reset } = useForm();
  const [qty, setQty] = React.useState(1);
  const [qtyType, setQtyType] = React.useState("BOX");

  return (
    <Form
      onSubmit={handleSubmit(values => {
        props.onSubmit(values, qty, qtyType);
        reset();
      })}
    >
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
              <option value={medsCategory.id} key={medsCategory.id}>
                {medsCategory.name}
              </option>
            ))}
          </FormSelect>
          <FormFeedback invalid={!!errors.medsCategoryId}>
            {errors.medsCategoryId && errors.medsCategoryId.message}
          </FormFeedback>
        </Col>
      </Row>

      <Row form>
        <Col md="6" className="form-group">
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
        <Col md="6" className="form-group">
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
      <Row>
        <Col md="1">
          <QtyInput
            type="number"
            min="1"
            id="feQty"
            name="qty"
            size="sm"
            placeholder="qty"
            value={qty}
            onChange={e => {
              if (e.target.value.length) {
                setQty(e.target.value);
              } else {
                setQty(1);
              }
            }}
          />
        </Col>
        <Col md="4">
          <FormSelect
            id="feQtyType"
            name="qtyType"
            size="sm"
            placeholder="Satuan"
            value={qtyType}
            onChange={e => setQtyType(e.target.value)}
          >
            <option value="BOX">Dus</option>
            <option value="CARTON">Karton</option>
          </FormSelect>
        </Col>
        <Col md="1">
          <Button
            type="submit"
            size="sm"
            outline
            theme="secondary"
            className="mr-2"
          >
            <i className="material-icons">add</i>
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

const medsCategoryMap = {
  FREE: "Obat Bebas",
  HERB: "Obat Herbal",
  LFREE: "Obat Bebas Terbatas",
  POTENT: "Obat Keras",
  PSY: "Obat Psikotropika",
  TRAD: "Obat Tradisional"
};

const medsTypeMap = {
  CAPSULE: "Kapsul",
  SYRUP: "Syrup",
  TABLET: "Tablet"
};

const ProcurementAdd = props => {
  const history = useHistory();
  const currentUser = React.useContext(UserContext);

  const createProcurement = useFetcher(ProcurementResource.createShape());
  const supplierList = useResource(SupplierResource.listShape(), {});
  const [fakeIdCounter, setFakeIdCounter] = React.useState(1);

  const [startDate, setStartDate] = React.useState(new Date());
  const { handleSubmit, register, errors } = useForm();
  const invalidateProcurementList = useInvalidator(
    ProcurementResource.listShape(),
    {}
  );

  const onSubmit = (values, e) => {
    const fetchBody = {
      ...values,
      staffId: currentUser.me.id,
      orderDate: dayjs(startDate).format("YYYY-MM-DD"),
      medicines: medicines.map(med => ({
        medicineId: med.id,
        qty: med.qty,
        qtyType: med.qtyType,

        medsTypeId: med.medsType.data.id,
        medsCategoryId: med.medsCategory.data.id,
        name: med.name || "",
        price: med.price || 0,
        factory: med.factory,
        minStock: med.minStock
      }))
    };

    createProcurement(fetchBody, {});
    invalidateProcurementList({});

    history.push("/pengadaan");
  };

  // Adding meds
  const [medicines, setMedicines] = React.useState([]);
  const minimalMedicineList = useResource(
    MedicineResource.minimalListShape(),
    {}
  );
  const addMedicine = (med, qty, qtyType) => {
    const medToAdd = {
      ...med,
      qty,
      qtyType
    };
    setMedicines([...medicines.filter(m => m.id !== med.id), medToAdd]);
  };

  return (
    <AuthorizedView permissionType="write-procurement" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Pengadaan"
          subtitle="Tambah Pengadaan"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader className="border-bottom">
                <Row>
                  <Col xs="6" sm="8" lg="10">
                    <VAlign>
                      <h6 className="m-0">Tambah Pengadaan</h6>
                    </VAlign>
                  </Col>
                  <Col lg="2">
                    <Button type="submit">Tambah Pengadaan Baru</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <ListGroup flush>
                  <ListGroupItem className="p-3">
                    <Row>
                      <Col>
                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="feSupplierId">Supplier</label>
                            <FormSelect
                              id="feSupplierId"
                              name="supplierId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {supplierList.map(supplier => (
                                <option value={supplier.id} key={supplier.id}>
                                  {supplier.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.supplierId}>
                              {errors.supplierId && errors.supplierId.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6" className="form-group">
                            <DatePickerWrapper className="d-flex flex-row justify-content-end align-items-end">
                              <DatePicker
                                id="date"
                                placeholderText="Tanggal Pemesanan"
                                selected={startDate}
                                onChange={date => setStartDate(date)}
                              />
                            </DatePickerWrapper>
                          </Col>
                        </Row>

                        {/* Add Proc Meds */}
                        <div className="p-0 pb-4">
                          <label htmlFor="feSupplierId">Daftar Pengadaan</label>

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
                                  Satuan
                                </th>
                                <th scope="col" className="border-0">
                                  Jumlah Pengadaan
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {medicines.map((med, index) => (
                                <tr key={med.id}>
                                  <td>{med.id}</td>
                                  <td>{med.name}</td>
                                  <td>{med.price}</td>
                                  <td>{med.medsCategory.data.name}</td>
                                  <td>{med.factory}</td>
                                  <td>{med.medsType.data.name}</td>
                                  <td>{`${med.qty} ${
                                    med.qtyType === "BOX" ? "Dus" : "Karton"
                                  }`}</td>
                                  <td className="d-flex justify-content-center">
                                    <Button
                                      type="button"
                                      size="sm"
                                      outline
                                      theme="danger"
                                      onClick={() =>
                                        setMedicines(
                                          medicines.filter(m => m.id !== med.id)
                                        )
                                      }
                                    >
                                      <i className="material-icons">delete</i>
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Form>
          </Card>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Obat Minimal</h6>
                  </VAlign>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <div className="p-0 pb-3">
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
                        Min. Stok
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {minimalMedicineList.map(medicine => (
                      <MinMedRow medicine={medicine} onAdd={addMedicine} />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Tambah Obat Baru</h6>
                  </VAlign>
                </Col>
              </Row>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <ListGroup flush>
                <ListGroupItem className="p-3">
                  <NewMedForm
                    onSubmit={(values, qty, qtyType) => {
                      const medToAdd = {
                        ...values,
                        id: `(baru-${fakeIdCounter})`,
                        medsCategory: {
                          data: {
                            id: values.medsCategoryId,
                            name: medsCategoryMap[values.medsCategoryId]
                          }
                        },
                        medsType: {
                          data: {
                            id: values.medsTypeId,
                            name: medsTypeMap[values.medsTypeId]
                          }
                        }
                      };
                      setFakeIdCounter(prev => (prev += 1));
                      addMedicine(medToAdd, qty, qtyType);
                    }}
                  />
                </ListGroupItem>
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </AuthorizedView>
  );
};

// const ProcurementEdit = props => {
//   const medsTypeList = useResource(MedsTypeResource.listShape(), {});
//   const medsCategoryList = useResource(MedsCategoryResource.listShape(), {});
//   const procurement = useResource(ProcurementResource.detailShape(), {
//     id: props.match.params.procurementId
//   });
//   const updateProcurement = useFetcher(ProcurementResource.updateShape());

//   const { handleSubmit, register, errors } = useForm({
//     defaultValues: {
//       name: procurement.name,
//       price: Number(procurement.price),
//       factory: procurement.factory,
//       currStock: procurement.currStock,
//       minStock: procurement.minStock,
//       medsTypeId: procurement.medsType.data.id,
//       medsCategoryId: procurement.medsCategory.data.id
//     }
//   });
//   // const invalidateProcurementList = useInvalidator(ProcurementResource.listShape(), {});

//   const onSubmit = (values, e) => {
//     updateProcurement(values, { id: props.match.params.procurementId });
//     // invalidateProcurementList({});

//     props.history.push("/pengadaan");
//   };

//   return (
//     <AuthorizedView permissionType="write-procurement" fallback={<AuthError />}>
//       <Row noGutters className="page-header py-4">
//         <PageTitle
//           title="Pengadaan"
//           subtitle="Ubah Pengadaan"
//           className="text-sm-left"
//         />
//       </Row>
//       <Row>
//         <Col>
//           <Card small className="mb-4">
//             <CardHeader className="border-bottom">
//               <Row>
//                 <Col xs="6" sm="8" lg="10">
//                   <VAlign>
//                     <h6 className="m-0">Ubah Pengadaan</h6>
//                   </VAlign>
//                 </Col>
//               </Row>
//             </CardHeader>
//             <CardBody className="p-0 pb-3">
//               <ListGroup flush>
//                 <ListGroupItem className="p-3">
//                   <Row>
//                     <Col>
//                       <Form onSubmit={handleSubmit(onSubmit)}>
//                         <Row form>
//                           <Col md="12" className="form-group">
//                             <label htmlFor="feName">Nama</label>
//                             <FormInput
//                               id="feName"
//                               name="name"
//                               placeholder="Nama"
//                               invalid={!!errors.name}
//                               innerRef={register({
//                                 required: "Wajib diisi",
//                                 minLength: {
//                                   value: 2,
//                                   message: "Minimal 2 karakter"
//                                 }
//                               })}
//                             />
//                             <FormFeedback invalid={!!errors.name}>
//                               {errors.name && errors.name.message}
//                             </FormFeedback>
//                           </Col>
//                         </Row>

//                         <Row form>
//                           <Col md="6" className="form-group">
//                             <label htmlFor="fePrice">Harga</label>
//                             <FormInput
//                               id="fePrice"
//                               name="price"
//                               placeholder="Harga"
//                               invalid={!!errors.price}
//                               innerRef={register({
//                                 required: "Wajib diisi",
//                                 pattern: {
//                                   value: /^\d+$/,
//                                   message: "Hanya angka"
//                                 }
//                               })}
//                             />
//                             <FormFeedback invalid={!!errors.price}>
//                               {errors.price && errors.price.message}
//                             </FormFeedback>
//                           </Col>
//                           <Col md="6" className="form-group">
//                             <label htmlFor="feMedsCategory">Jenis</label>
//                             <FormSelect
//                               id="feMedsCategory"
//                               name="medsCategoryId"
//                               innerRef={register({
//                                 required: "Wajib dipilih"
//                               })}
//                             >
//                               {medsCategoryList.map(medsCategory => (
//                                 <option
//                                   value={medsCategory.id}
//                                   key={medsCategory.id}
//                                 >
//                                   {medsCategory.name}
//                                 </option>
//                               ))}
//                             </FormSelect>
//                             <FormFeedback invalid={!!errors.medsCategoryId}>
//                               {errors.medsCategoryId &&
//                                 errors.medsCategoryId.message}
//                             </FormFeedback>
//                           </Col>
//                         </Row>

//                         <Row form>
//                           <Col md="4" className="form-group">
//                             <label htmlFor="feCurrStock">Stok</label>
//                             <FormInput
//                               id="feCurrStock"
//                               name="currStock"
//                               placeholder="Stok"
//                               invalid={!!errors.currStock}
//                               innerRef={register({
//                                 required: "Wajib diisi",
//                                 pattern: {
//                                   value: /^\d+$/,
//                                   message: "Hanya angka"
//                                 }
//                               })}
//                             />
//                             <FormFeedback invalid={!!errors.currStock}>
//                               {errors.currStock && errors.currStock.message}
//                             </FormFeedback>
//                           </Col>
//                           <Col md="4" className="form-group">
//                             <label htmlFor="feMedsType">Satuan</label>
//                             <FormSelect
//                               id="feMedsType"
//                               name="medsTypeId"
//                               innerRef={register({
//                                 required: "Wajib dipilih"
//                               })}
//                             >
//                               {medsTypeList.map(medsType => (
//                                 <option value={medsType.id} key={medsType.id}>
//                                   {medsType.name}
//                                 </option>
//                               ))}
//                             </FormSelect>
//                             <FormFeedback invalid={!!errors.medsTypeId}>
//                               {errors.medsTypeId && errors.medsTypeId.message}
//                             </FormFeedback>
//                           </Col>
//                           <Col md="4" className="form-group">
//                             <label htmlFor="feMinStock">Stok Minimal</label>
//                             <FormInput
//                               id="feMinStock"
//                               name="minStock"
//                               placeholder="Stok Minimal"
//                               invalid={!!errors.minStock}
//                               innerRef={register({
//                                 required: "Wajib diisi",
//                                 pattern: {
//                                   value: /^\d+$/,
//                                   message: "Hanya angka"
//                                 }
//                               })}
//                             />
//                             <FormFeedback invalid={!!errors.minStock}>
//                               {errors.minStock && errors.minStock.message}
//                             </FormFeedback>
//                           </Col>
//                         </Row>
//                         <Row form>
//                           <Col md="12" className="form-group">
//                             <label htmlFor="feFactory">Pabrik</label>
//                             <FormInput
//                               id="feFactory"
//                               name="factory"
//                               placeholder="Pabrik"
//                               invalid={!!errors.factory}
//                               innerRef={register({
//                                 required: "Wajib diisi",
//                                 minLength: {
//                                   value: 2,
//                                   message: "Minimal 2 karakter"
//                                 }
//                               })}
//                             />
//                             <FormFeedback invalid={!!errors.factory}>
//                               {errors.factory && errors.factory.message}
//                             </FormFeedback>
//                           </Col>
//                         </Row>
//                         <Button type="submit">Ubah Pengadaan</Button>
//                       </Form>
//                     </Col>
//                   </Row>
//                 </ListGroupItem>
//               </ListGroup>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </AuthorizedView>
//   );
// };

const Procurement = () => {
  return (
    <Container fluid className="main-content-container px-4">
      <Route exact path="/pengadaan" component={ProcurementList} />
      <Route path="/pengadaan/add" component={ProcurementAdd} />
      <Route path="/pengadaan/:procurementId" component={ProcurementDetail} />
      {/* <Route
        path="/pengadaan/edit/:procurementId"
        component={ProcurementEdit}
      /> */}
    </Container>
  );
};

export default Procurement;

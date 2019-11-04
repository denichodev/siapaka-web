import React from "react";
import { Route, Link } from "react-router-dom";
import { get } from "lodash-es";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import styled from "styled-components";
import AuthError from "./AuthError";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import UserContext from "contexts/UserContext";

import { VAlign } from "styles/commons";
import TransactionResource from "resources/transaction";
import DoctorResource from "resources/doctor";
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

const ListActions = ({ transaction }) => {
  const del = useFetcher(TransactionResource.deleteShape());
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      del(undefined, { id: transaction.id });
    }
  };

  const handleBlur = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
  };

  if (!transaction) {
    return null;
  }

  return (
    <>
      <AuthorizedView permissionType="edit-transaction">
        <Link to={`/transaksi/edit/${transaction.id}`}>
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

      <AuthorizedView permissionType="delete-transaction">
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

const TransactionList = () => {
  const [query, setQuery] = React.useState("");
  const [queryPaid, setQueryPaid] = React.useState("");
  const transactionList = useResource(TransactionResource.listShape(), {});

  const onSearch = e => {
    setQuery(e.target.value);
  };

  const onSearchPaid = e => {
    setQueryPaid(e.target.value);
  };

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Transaksi"
          subtitle="Daftar Transaksi"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col lg="2">
                  <VAlign>
                    <h6 className="m-0">Transaksi Pending</h6>
                  </VAlign>
                </Col>
                <Col lg={{ size: 4 }}>
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

                <Col lg={{ size: 2, offset: 4 }}>
                  <AuthorizedView permissionType="add-transaction">
                    <Link to="/transaksi/add">
                      <Button block size="sm" theme="primary">
                        Tambah Transaksi
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
                      Kode
                    </th>
                    <th scope="col" className="border-0">
                      Tanggal
                    </th>
                    <th scope="col" className="border-0">
                      Pembeli
                    </th>
                    <th scope="col" className="border-0">
                      No. Telp
                    </th>
                    <th scope="col" className="border-0">
                      Dokter
                    </th>
                    <th scope="col" className="border-0">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionList
                    .filter(
                      transaction =>
                        transaction.id.toLowerCase().includes(query) &&
                        !transaction.payAmt
                    )
                    .map(transaction => (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>
                          {dayjs(transaction.date).format("DD MMMM YYYY")}
                        </td>
                        <td>{transaction.customer.data.name}</td>
                        <td>{transaction.customer.data.id}</td>
                        <td>{get(transaction, "doctor.data.name", "-")}</td>
                        <td>{transaction.payAmt ? "PAID" : "PENDING"}</td>
                        <React.Suspense>
                          <td className="d-flex justify-content-center">
                            <ListActions transaction={transaction} />
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
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col lg="4">
                  <VAlign>
                    <h6 className="m-0">Transaksi Terbayar</h6>
                  </VAlign>
                </Col>
                <Col lg={{ size: 4, offset: 4 }}>
                  <VAlign>
                    <FormInput
                      id="feQuery"
                      name="query"
                      placeholder="Cari"
                      onChange={onSearchPaid}
                      value={queryPaid}
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
                      Kode
                    </th>
                    <th scope="col" className="border-0">
                      Tanggal
                    </th>
                    <th scope="col" className="border-0">
                      Pembeli
                    </th>
                    <th scope="col" className="border-0">
                      No. Telp
                    </th>
                    <th scope="col" className="border-0">
                      Dokter
                    </th>
                    <th scope="col" className="border-0">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactionList
                    .filter(
                      transaction =>
                        transaction.id.toLowerCase().includes(queryPaid) &&
                        transaction.payAmt
                    )
                    .map(transaction => (
                      <tr key={transaction.id}>
                        <td>{transaction.id}</td>
                        <td>
                          {dayjs(transaction.date).format("DD MMMM YYYY")}
                        </td>
                        <td>{transaction.customer.data.name}</td>
                        <td>{transaction.customer.data.id}</td>
                        <td>{get(transaction, "doctor.data.name", "-")}</td>
                        <td>{transaction.payAmt ? "PAID" : "PENDING"}</td>
                        <React.Suspense>
                          <td className="d-flex justify-content-center">
                            <ListActions transaction={transaction} />
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

const MinMedRow = ({ medicine, onAdd, hideActions }) => {
  const [qty, setQty] = React.useState(1);

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
          <Button
            type="button"
            size="sm"
            outline
            theme="secondary"
            className="mr-2"
            onClick={() => onAdd(medicine, qty)}
          >
            <i className="material-icons">add</i>
          </Button>
        </td>
      </React.Suspense>
    </tr>
  );
};

const getSubtotalAndTax = medicines => {
  const total = medicines.reduce((prev, next) => {
    prev = prev + Number(next.qty) * Number(next.price);

    return prev;
  }, 0);

  return [total, total * 0.1];
};

const TransactionAdd = props => {
  const doctorList = useResource(DoctorResource.listShape(), {});
  const createTransaction = useFetcher(TransactionResource.createShape());
  const history = useHistory();
  const [startDate, setStartDate] = React.useState(new Date());

  const { handleSubmit, register, errors } = useForm();
  const invalidateTransactionList = useInvalidator(
    TransactionResource.listShape(),
    {}
  );

  // Adding meds
  const [query, setQuery] = React.useState("");
  const onSearch = e => {
    setQuery(e.target.value);
  };
  const [instruction, setInstruction] = React.useState("");
  const onSetInstruction = e => {
    setInstruction(e.target.value);
  };
  const [medicines, setMedicines] = React.useState([]);
  const medicineList = useResource(MedicineResource.listShape(), {});
  const addMedicine = (med, qty) => {
    const medToAdd = {
      ...med,
      qty,
      instruction
    };
    setMedicines([...medicines.filter(m => m.id !== med.id), medToAdd]);
    setInstruction("");
  };

  const currentUser = React.useContext(UserContext);
  const onSubmit = (values, e) => {
    const [subtotal, tax] = getSubtotalAndTax(medicines);

    const fetchBody = {
      ...values,
      staffId: currentUser.me.id,
      orderDate: dayjs(startDate).format("YYYY-MM-DD"),
      doctorId: values.doctorId === "-" ? null : values.doctorId,
      subtotal,
      tax,
      medicines: medicines.map(med => ({
        id: med.id,
        qty: med.qty,
        instruction: med.instruction
      }))
    };

    console.log(fetchBody);
    createTransaction(fetchBody, {});
    invalidateTransactionList({});

    history.push("/transaksi");
  };

  return (
    <AuthorizedView permissionType="add-transaction" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Transaksi"
          subtitle="Tambah Transaksi"
          className="text-sm-left"
        />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <CardHeader className="border-bottom">
                <Row>
                  <Col xs="6" sm="8" lg="9">
                    <VAlign>
                      <h6 className="m-0">Tambah Transaksi</h6>
                    </VAlign>
                  </Col>
                  <Col lg="3">
                    <Button block type="submit">
                      Tambah Transaksi Baru
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="p-0 pb-3">
                <ListGroup flush>
                  <ListGroupItem className="p-3">
                    <Row form>
                      <Col md="6" className="form-group">
                        <DatePickerWrapper className="d-flex flex-row justify-content-start align-items-start">
                          <DatePicker
                            id="date"
                            placeholderText="Tanggal Pemesanan"
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                          />
                        </DatePickerWrapper>
                      </Col>
                    </Row>
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
                    <Row form>
                      <Col md="6" className="form-group">
                        <label htmlFor="feDoctorId">Dokter</label>
                        <FormSelect
                          id="feDoctorId"
                          name="doctorId"
                          innerRef={register({
                            required: "Wajib dipilih"
                          })}
                        >
                          <option value="-">Tanpa Dokter</option>
                          {doctorList.map(doctor => (
                            <option value={doctor.id} key={doctor.id}>
                              {doctor.name}
                            </option>
                          ))}
                        </FormSelect>
                        <FormFeedback invalid={!!errors.doctorId}>
                          {errors.doctorId && errors.doctorId.message}
                        </FormFeedback>
                      </Col>
                    </Row>

                    {/* Add Meds */}
                    <div className="p-0 pb-4">
                      <label htmlFor="feSupplierId">Obat:</label>

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
                              Golongan
                            </th>
                            <th scope="col" className="border-0">
                              Jml. Beli
                            </th>
                            <th scope="col" className="border-0">
                              Satuan
                            </th>
                            <th scope="col" className="border-0">
                              Instruksi
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
                              <td>{med.qty}</td>
                              <td>{med.medsType.data.name}</td>
                              <td>{med.instruction}</td>
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
                  </ListGroupItem>
                </ListGroup>
              </CardBody>
            </Form>
          </Card>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="4" sm="4" lg="2">
                  <VAlign>
                    <h6 className="m-0">Daftar Obat</h6>
                  </VAlign>
                </Col>
                <Col lg={{ size: 2 }}>
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
                <Col lg={{ size: 4, offset: 4 }}>
                  <VAlign>
                    <FormInput
                      id="feInstruction"
                      name="instruction"
                      placeholder="Instruksi"
                      onChange={onSetInstruction}
                      value={instruction}
                    />
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
                    {medicineList
                      .filter(med => med.name.toLowerCase().includes(query))
                      .map(medicine => (
                        <MinMedRow medicine={medicine} onAdd={addMedicine} />
                      ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </AuthorizedView>
  );
};

const TransactionEdit = props => {
  const transaction = useResource(TransactionResource.detailShape(), {
    id: props.match.params.transactionId
  });
  const updateTransaction = useFetcher(TransactionResource.updateShape());

  const { handleSubmit, register, errors } = useForm({
    defaultValues: {
      name: transaction.name,
      phoneNo: transaction.phoneNo,
      address: transaction.address
    }
  });
  // const invalidateTransactionList = useInvalidator(TransactionResource.listShape(), {});

  const onSubmit = (values, e) => {
    updateTransaction(values, { id: props.match.params.transactionId });
    // invalidateTransactionList({});

    props.history.push("/transaksi");
  };

  return (
    <AuthorizedView permissionType="edit-transaction" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Transaksi"
          subtitle="Ubah Transaksi"
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
                    <h6 className="m-0">Ubah Transaksi</h6>
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
                        <Button type="submit">Ubah Transaksi</Button>
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

const Transaction = () => {
  return (
    <AuthorizedView permissionType="read-transaction" fallback={<AuthError />}>
      <Container fluid className="main-content-container px-4">
        <Route exact path="/transaksi" component={TransactionList} />
        <Route path="/transaksi/add" component={TransactionAdd} />
        <Route
          path="/transaksi/edit/:transactionId"
          component={TransactionEdit}
        />
      </Container>
    </AuthorizedView>
  );
};

export default Transaction;

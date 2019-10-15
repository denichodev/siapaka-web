import React from "react";
import { Route, Link } from "react-router-dom";
import { useResource, useFetcher, useInvalidator } from "rest-hooks";
import useForm from "react-hook-form";
import AuthError from "./AuthError";
import UserContext from "contexts/UserContext";

import { VAlign } from "styles/commons";
import StaffResource from "resources/staff";
import OutletResource from "resources/outlet";
import RoleResource from "resources/role";
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

const ListActions = ({ staff }) => {
  const del = useFetcher(StaffResource.deleteShape());
  const currentUser = React.useContext(UserContext);

  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
    } else {
      del(undefined, { id: staff.id });
    }
  };

  const handleBlur = () => {
    if (confirmDelete) {
      setConfirmDelete(false);
    }
  };

  if (!staff) {
    return null;
  }

  if (currentUser.me.id === staff.id) {
    return null;
  }

  return (
    <>
      <AuthorizedView permissionType="edit-staff">
        <Link to={`/karyawan/edit/${staff.id}`}>
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

      <AuthorizedView permissionType="delete-staff">
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

const StaffList = () => {
  const [query, setQuery] = React.useState("");
  const staffList = useResource(StaffResource.listShape(), {});

  const onSearch = e => {
    setQuery(e.target.value);
  };

  return (
    <>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Karyawan"
          subtitle="Daftar Karyawan"
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
                  <AuthorizedView permissionType="add-staff">
                    <Link to="/karyawan/add">
                      <Button block size="sm" theme="primary">
                        Tambah Karyawan
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
                      Email
                    </th>
                    <th scope="col" className="border-0">
                      Role
                    </th>
                    <th scope="col" className="border-0">
                      Outlet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffList
                    .filter(staff => staff.name.toLowerCase().includes(query))
                    .map(staff => (
                      <tr key={staff.id}>
                        <td>{staff.id}</td>
                        <td>{staff.name}</td>
                        <td>{staff.email}</td>
                        <td>{staff.role.data.name}</td>
                        <td>{staff.outlet.data.name}</td>
                        <React.Suspense>
                          <td className="d-flex justify-content-center">
                            <ListActions staff={staff} />
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

const StaffAdd = props => {
  const createStaff = useFetcher(StaffResource.createShape());
  const outletList = useResource(OutletResource.listShape(), {});
  const roleList = useResource(RoleResource.listShape(), {});
  const history = useHistory();
  const { handleSubmit, register, errors, watch } = useForm();
  const invalidateStaffList = useInvalidator(StaffResource.listShape(), {});

  const onSubmit = (values, e) => {
    createStaff(values, {});
    invalidateStaffList({});

    history.push("/karyawan");
  };

  return (
    <AuthorizedView permissionType="add-staff" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Karyawan"
          subtitle="Tambah Karyawan"
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
                    <h6 className="m-0">Tambah Karyawan</h6>
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
                        <FormGroup>
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
                        </FormGroup>
                        <FormGroup>
                          <label htmlFor="feEmail">Email</label>
                          <FormInput
                            name="email"
                            id="feEmail"
                            placeholder="example@gmail.com"
                            invalid={!!errors.email}
                            innerRef={register({
                              required: "Wajib diisi",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Email tidak valid"
                              }
                            })}
                          />
                          <FormFeedback invalid={!!errors.email}>
                            {errors.email && errors.email.message}
                          </FormFeedback>
                        </FormGroup>

                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="fePass">Password</label>
                            <FormInput
                              id="fePass"
                              name="password"
                              type="password"
                              placeholder="Password"
                              invalid={!!errors.password}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 8,
                                  message: "Minimal 8 karakter"
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.password}>
                              {errors.password && errors.password.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="fePassConf">
                              Konfirmasi Password
                            </label>
                            <FormInput
                              name="passwordConf"
                              id="fePassConf"
                              placeholder="Konfirmasi Password"
                              type="password"
                              invalid={!!errors.passwordConf}
                              innerRef={register({
                                required: "Wajib diisi",
                                minLength: {
                                  value: 8,
                                  message: "Minimal 8 karakter"
                                },
                                validate: value =>
                                  value === watch("password") ||
                                  "Tidak sama dengan passsword"
                              })}
                            />
                            <FormFeedback invalid={!!errors.passwordConf}>
                              {errors.passwordConf &&
                                errors.passwordConf.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="feOutlet">Outlet</label>
                            <FormSelect
                              id="feOutlet"
                              name="outletId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {outletList.map(outlet => (
                                <option value={outlet.id} key={outlet.id}>
                                  {outlet.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.outletId}>
                              {errors.outletId && errors.outletId.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="feRole">Role</label>
                            <FormSelect
                              id="feRole"
                              name="roleId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {roleList.map(role => (
                                <option value={role.id} key={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.roleId}>
                              {errors.roleId && errors.roleId.message}
                            </FormFeedback>
                            <FormFeedback invalid={!!errors.passwordConf}>
                              {errors.passwordConf &&
                                errors.passwordConf.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <Button type="submit">Tambah Karyawan Baru</Button>
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

const StaffEdit = props => {
  const staff = useResource(StaffResource.detailShape(), {
    id: props.match.params.staffId
  });
  const updateStaff = useFetcher(StaffResource.updateShape());

  const outletList = useResource(OutletResource.listShape(), {});
  const roleList = useResource(RoleResource.listShape(), {});

  const { handleSubmit, register, errors, watch } = useForm({
    defaultValues: {
      name: staff.name,
      email: staff.email,
      address: staff.address,
      outletId: staff.outlet.data.id,
      roleId: staff.role.data.id
    }
  });
  // const invalidateStaffList = useInvalidator(StaffResource.listShape(), {});

  const onSubmit = (values, e) => {
    updateStaff(values, { id: props.match.params.staffId });
    // invalidateStaffList({});

    props.history.push("/karyawan");
  };

  return (
    <AuthorizedView permissionType="edit-staff" fallback={<AuthError />}>
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Karyawan"
          subtitle="Ubah Karyawan"
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
                    <h6 className="m-0">Ubah Karyawan</h6>
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
                        <FormGroup>
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
                        </FormGroup>
                        <FormGroup>
                          <label htmlFor="feEmail">Email</label>
                          <FormInput
                            name="email"
                            id="feEmail"
                            placeholder="example@gmail.com"
                            invalid={!!errors.email}
                            innerRef={register({
                              required: "Wajib diisi",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                message: "Email tidak valid"
                              }
                            })}
                          />
                          <FormFeedback invalid={!!errors.email}>
                            {errors.email && errors.email.message}
                          </FormFeedback>
                        </FormGroup>

                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="fePass">Password</label>
                            <FormInput
                              id="fePass"
                              name="password"
                              type="password"
                              placeholder="Tidak berubah"
                              invalid={!!errors.password}
                              innerRef={register({
                                validate: value => {
                                  if (value.length === 0) {
                                    return true;
                                  } else {
                                    if (value.length < 8) {
                                      return "Minimal 8 karakter";
                                    } else {
                                      return true;
                                    }
                                  }
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.password}>
                              {errors.password && errors.password.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="fePassConf">
                              Konfirmasi Password
                            </label>
                            <FormInput
                              name="passwordConf"
                              id="fePassConf"
                              placeholder="Tidak berubah"
                              type="password"
                              invalid={!!errors.passwordConf}
                              innerRef={register({
                                validate: value => {
                                  if (value.length === 0) {
                                    return true;
                                  } else {
                                    if (value.length < 8) {
                                      return "Minimal 8 karakter";
                                    } else {
                                      if (value !== watch("password")) {
                                        return "Tidak sama dengan password";
                                      }

                                      return true;
                                    }
                                  }
                                }
                              })}
                            />
                            <FormFeedback invalid={!!errors.passwordConf}>
                              {errors.passwordConf &&
                                errors.passwordConf.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <Row form>
                          <Col md="6" className="form-group">
                            <label htmlFor="feOutlet">Outlet</label>
                            <FormSelect
                              id="feOutlet"
                              name="outletId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {outletList.map(outlet => (
                                <option value={outlet.id} key={outlet.id}>
                                  {outlet.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.outletId}>
                              {errors.outletId && errors.outletId.message}
                            </FormFeedback>
                          </Col>
                          <Col md="6" className="form-group">
                            <label htmlFor="feRole">Role</label>
                            <FormSelect
                              id="feRole"
                              name="roleId"
                              innerRef={register({
                                required: "Wajib dipilih"
                              })}
                            >
                              {roleList.map(role => (
                                <option value={role.id} key={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </FormSelect>
                            <FormFeedback invalid={!!errors.roleId}>
                              {errors.roleId && errors.roleId.message}
                            </FormFeedback>
                            <FormFeedback invalid={!!errors.passwordConf}>
                              {errors.passwordConf &&
                                errors.passwordConf.message}
                            </FormFeedback>
                          </Col>
                        </Row>

                        <Button type="submit">Ubah Karyawan</Button>
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

const Staff = () => {
  return (
    <AuthorizedView permissionType="read-staff" fallback={<AuthError />}>
      <Container fluid className="main-content-container px-4">
        <Route exact path="/karyawan" component={StaffList} />
        <Route path="/karyawan/add" component={StaffAdd} />
        <Route path="/karyawan/edit/:staffId" component={StaffEdit} />
      </Container>
    </AuthorizedView>
  );
};

export default Staff;

import React from 'react';
import { useResource } from 'rest-hooks';
import { VAlign } from 'styles/commons';
import DoctorResource from 'resources/doctor';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button
} from 'shards-react';

import PageTitle from '../components/common/PageTitle';

const DoctorList = () => {
  const doctorList = useResource(DoctorResource.listShape(), {});

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          title="Dokter"
          subtitle="Daftar Dokter"
          className="text-sm-left"
        />
      </Row>

      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <Row>
                <Col xs="6" sm="8" lg="10">
                  <VAlign>
                    <h6 className="m-0">Seluruh Dokter</h6>
                  </VAlign>
                </Col>

                <Col xs="6" sm="4" lg="2">
                  <Button block size="sm" theme="primary">
                    Tambah Dokter
                  </Button>
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
                  {doctorList.map(doctor => (
                    <tr key={doctor.id}>
                      <td>{doctor.id}</td>
                      <td>{doctor.name}</td>
                      <td>{doctor.address}</td>
                      <td>{doctor.phoneNo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DoctorList;

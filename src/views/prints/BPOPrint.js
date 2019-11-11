import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { get } from "lodash-es";

import { createMedicinesFromAPI } from "../Procurement";

import logo from "./logo.png";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px;
`;

const BorderBox = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  height: 100%;
  padding: 16px;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
`;

const HeaderWrapper = styled.div`
  display: flex;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 100px;
  padding-left: 16px;
`;

const Separator = styled.div`
  border: 1px solid black;
  width: 100%;
  height: 1px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ContentTitle = styled.div`
  font-weight: 700;
  font-size: 32px;
  width: 100%;
  text-align: center;
  line-height: 1;
`;

const ContentMeta = styled.div`
  width: 100%;
  text-align: right;
  margin-bottom: 16px;
`;

const SupplierBox = styled.div`
  border: 1px dotted black;
  max-width: 320px;
  padding: 8px;
  margin-bottom: 16px;
`;

const Signee = styled.div`
  position: relative;
  width: 300px;
  right: 0;
  align-self: flex-end;
  justify-self: flex-end;
  top: 300px;
  right: 0;
`;

const RightSideMeta = styled.div`
  position: relative;
  text-align: right;
  align-self: flex-end;
  justify-self: flex-end;
  right: 0;
`;

class BPOPrint extends React.Component {
  render() {
    const { data } = this.props;
    const pharmacist = data.transaction.staff;
    console.log("phar", pharmacist);

    const total =
      Number(data.transaction.tax) + Number(data.transaction.subtotal);

    return (
      <Wrapper>
        <BorderBox>
          <HeaderWrapper>
            <Logo src={logo} />
            <HeaderTitle>
              <h2 style={{ fontWeight: 700 }}>
                <strong>APOTEK</strong>
              </h2>
              <h3>ATMA MEDIKA</h3>
              <div>
                <div>Jl. Babarsari No. 43 Yogyakarta 55281</div>
                <div>Telp: 0274-487711</div>
                <div>http://atmamedika.com</div>
              </div>
            </HeaderTitle>
          </HeaderWrapper>
          <Separator />
          <ContentTitle>BUKTI PENGAMBIILAN OBAT</ContentTitle>
          <Separator />
          <SupplierBox>
            <div>
              Tanggal: {dayjs(data.transaction.date).format("DD MMMM YYYY")}
            </div>
            <div>No. Transaksi: {data.transaction.id}</div>
            <div>Nama: {data.transaction.customer.data.name}</div>
            <div>No. Telp: {data.transaction.customer.data.id}</div>
            <div>Dokter: {get(data.transaction, "doctor.data.name", "-")}</div>
          </SupplierBox>
          <table className="table">
            <thead>
              <tr>
                <th>Kode Obat</th>
                <th>Obat</th>
                <th>Jumlah</th>
                <th>Satuan</th>
                <th>Aturan Minum</th>
              </tr>
            </thead>
            <tbody>
              {data.transaction.medicines.data.map((med, index) => (
                <tr key={med.medicine.data.id}>
                  <td>{med.medicine.data.id}</td>
                  <td>{med.medicine.data.name}</td>
                  <td>{med.qty}</td>
                  <td>{med.medicine.data.medsType.data.name}</td>
                  <td>{med.instruction ? med.instruction : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Separator />
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center"
            }}
          >
            <div>
              Kasir,
              <br />
              <br />
              <br />
              <br />({data.user.name})
            </div>
            <div>
              Serah,
              <br />
              <br />
              <br />
              <br />({pharmacist.data.name})
            </div>
            <div>
              Terima,
              <br />
              <br />
              <br />
              <br />({data.transaction.customer.data.name})
            </div>
          </div>
        </BorderBox>
      </Wrapper>
    );
  }
}

export default BPOPrint;

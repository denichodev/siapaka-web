import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";

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
  margin-top: 32px;
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

class ProcurementPrint extends React.Component {
  render() {
    const { data, user } = this.props;

    const meds = createMedicinesFromAPI(
      data.medicines.data,
      data.unverifiedMedicines.data
    );

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
          <ContentTitle>Surat Pemesanan Obat</ContentTitle>
          <ContentMeta>No: {data.id}</ContentMeta>
          <ContentMeta>
            Tanggal: {dayjs(data.orderDate).format("DD MMMM YYYY")}
          </ContentMeta>
          <SupplierBox>
            <div>Kepada Yth:</div>
            <div>{data.supplier.data.name}</div>
            <div>{data.supplier.data.address}</div>
            <div>{data.supplier.data.phoneNo}</div>
          </SupplierBox>
          <div style={{ marginBottom: 32 }}>
            Mohon untuk disediakan obat-obat berikut:
          </div>
          <table className="table">
            <thead>
              <th>No</th>
              <th>Nama Obat</th>
              <th>Pabrik</th>
              <th>Sediaan</th>
              <th>Satuan</th>
              <th>Jumlah</th>
            </thead>
            <tbody>
              {meds.map((med, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{med.name}</td>
                  <td>{med.factory}</td>
                  <td>{med.medsType.data.name}</td>
                  <td>{med.qtyType}</td>
                  <td>{med.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Signee>
            <div>Apoteker,</div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div>({user.name})</div>
          </Signee>
        </BorderBox>
      </Wrapper>
    );
  }
}

export default ProcurementPrint;

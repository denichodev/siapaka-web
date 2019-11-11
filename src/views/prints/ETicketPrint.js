import React from "react";
import styled from "styled-components";
import dayjs from "dayjs";
import { get } from "lodash-es";

import { createMedicinesFromAPI } from "../Procurement";

import logo from "./logo.png";

const Wrapper = styled.div`
  width: 50%;
  height: 500px;
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
    const med = data.medicine;

    console.log("med", med);

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
          <SupplierBox>
            <div>
              Tanggal: {dayjs(data.transaction.date).format("DD MMMM YYYY")}
            </div>
            <div>Nama: {data.transaction.customer.data.name}</div>
            <div>Dokter: {get(data.transaction, "doctor.data.name", "-")}</div>
          </SupplierBox>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column"
            }}
          >
            <div>{med.medicine.data.name}</div>
            <div>
              <strong>
                {med.instruction ? med.instruction : "Tanpa instruksi"}
              </strong>
            </div>
            <div style={{ marginTop: 16 }}>SEMOGA LEKAS SEMBUH</div>
          </div>
        </BorderBox>
      </Wrapper>
    );
  }
}

export default BPOPrint;

import React from "react";
import { Col } from "antd";
import { ShowFullName } from "../../components/pages";
import { EnvelopeByEmailColor } from "../../components/ui";

export const QuotationInformation = ({
  quotation,
  onSetContact,
  onOpenDrawerContact,
}) => (
  <>
    <ShowFullName
      contact={quotation}
      onSetContact={onSetContact}
      onOpenDrawerContact={onOpenDrawerContact}
    />
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Teléfono"
        content={`${quotation?.phone?.countryCode} ${quotation?.phone?.number}`}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor title="Email" content={quotation?.email || ""} />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Tipo de Plan"
        content={quotation?.planType}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Giro del negocio"
        content={quotation?.businessLine}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="¿Cuenta con asesoría contable?"
        content={quotation?.accountingAdvice ? "Si" : "No"}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="¿Tiene planilla?"
        content={quotation?.spreadsheet ? "Si" : "No"}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Tipo de contabilidad"
        content={quotation?.typeAccounting}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Compras (Mensual)"
        content={quotation?.monthlyPurchases}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor title="Ruc" content={quotation?.ruc} />
    </Col>
    <Col xs={24}>
      <EnvelopeByEmailColor
        title="Régimen tributario"
        content={quotation?.taxRegime}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Presupuesto tributario"
        content={quotation?.monthlyBudget}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="¿Cuántos trabajadores?"
        content={quotation?.howManyWorkers}
      />
    </Col>
    <Col xs={24} sm={12}>
      <EnvelopeByEmailColor
        title="Ventas (Mensual)"
        content={quotation?.monthlySales}
      />
    </Col>
  </>
);

import React, { useEffect, useState } from "react";
import { Row, Col, Input, Button, Select, notification } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Definición del esquema de validación
const schema = yup.object().shape({
    email: yup.string()
        .test('multiple-emails', 'Por favor, ingresa correos válidos', value => {
            if (!value) return true; // Permite vacío
            const emails = value.split(',').map(email => email.trim());
            return emails.every(email => yup.string().email().isValidSync(email));
        })
        .notRequired(),
    phone: yup.string()
        .matches(/^[0-9,\s+]+$/, "Solo se permiten números y comas")
        .notRequired(),
}).test('at-least-one', 'Debes ingresar al menos un correo o teléfono', function (value) {
    return value.email || value.phone;
});

export const SpamForm = ({ onSubmit, spam }) => {
    const { control, handleSubmit, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const [dataType, setDataType] = useState('email'); // Estado para seleccionar el tipo de dato


    useEffect(() => {
        if (spam) {
            reset(spam);
        }
    }, [spam, reset]);


    const submitForm = (data) => {
        const emails = (data.email || "").split(',').map(email => email.trim()).filter(Boolean);
        const phones = (data.phone || "").split(',').map(phone => phone.trim()).filter(Boolean);

        // Llama a la función onSubmit con los datos procesados
        onSubmit({ email: emails, phone: phones });

        reset()

        notification.success({ message: "Spam agregado correctamente!" });
    };

    return (
        <form onSubmit={handleSubmit(submitForm)}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Select
                        value={dataType}
                        onChange={setDataType}
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="email">Correo Electrónico</Select.Option>
                        <Select.Option value="phone">Teléfono</Select.Option>
                    </Select>
                </Col>
                {dataType === 'email' && (
                    <Col span={24}>
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Correos Electrónicos (separados por comas)" />
                            )}
                        />
                    </Col>
                )}
                {dataType === 'phone' && (
                    <Col span={24}>
                        <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Teléfonos (separados por comas)" />
                            )}
                        />
                    </Col>
                )}
                <Col span={24}>
                    <Button type="primary" htmlType="submit">
                        Guardar Spam
                    </Button>
                </Col>
            </Row>
        </form>
    );
};

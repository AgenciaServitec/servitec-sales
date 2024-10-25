import React from 'react';
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Title from "antd/lib/typography/Title";
import {useNavigate} from "react-router";
import {Form, Input, InputNumber, notification, Select, TextArea} from "../../../components/ui";
import {Controller, useForm} from "react-hook-form";
import { assign, capitalize, concat } from "lodash";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useFormUtils} from "../../../hooks";

export const SpamIntegration = () => {

    const navigate = useNavigate()

    const onSubmitSaveSpam = async (formData) =>{
        try{
            const _spam = mapSpam(formData)

            await  saveSpam(_spam);

            notification({type:"success"});

            onGoBack();
        }catch (e){
            console.log("ErrorSaveSpam: ",e)
            notification({type:"error"})
        };
    };

    const saveSpam = async (spam) =>{
        spamId === "new" ? await postSpam(spam) : await putSpam(spam);

        const responseStatus = postSpamResponse.ok || putSpamResponse.ok;

        if (!responseStatus) return notification({type:"error"})
    }

    const mapSpam = (formData) =>{
        const existsAllOption = formData.spamsIds.find(
            (clientId) => clientId == "all"
        );

        const clientsIds = existsAllOption ? ["all"] : formData.clientsIds;

        return assign(
            {},
            {
                id: spam.id,
                clientsIds: clientsIds,

            }
        )
    }
    const onGoBack = () => navigate(-1);


    return (
        <Spam

        />
    );
};

const Spam = () =>{

    const schema = yup.object({
        clientsIds: yup.array().min(1).required(),
        roleCode: yup.string().required(),
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().email().required(),
        password: yup.string().required(),
        countryCode: yup.string().required(),
        phoneNumber: yup.number().required(),
    });

    const {
        formState: { errors },
        handleSubmit,
        control,
        reset,
        watch,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const { required, error } = useFormUtils({ errors, schema });

    return (
        <Row>
            <Col span={24}>
                <Title level={3}> Spam </Title>
            </Col>
            <Col span={24}>
                <Form>
                    <Row gutter={[16,16]}>
                        <Col span={24}>
                            <Controller
                                name="spam"
                                control={control}
                                defaultValue={[]}
                                render={({ field: { onChange, value, name } }) => (
                                    <Select
                                        label="Tipo"
                                        value={value}
                                        onChange={onChange}
                                        error={error(name)}
                                        required={required(name)}
                                        options={[
                                            {
                                                label:"Email",
                                                value: "email",
                                            },
                                            {
                                                label:"Telefono",
                                                value:"phone"
                                            }
                                        ]}
                                    />
                                )}
                            />
                        </Col>
                        <Col span={24}>
                            <Controller
                                name="spamInfo"
                                control={control}
                                defaultValue=""
                                render={({ field: { onChange, value, name } }) => (
                                    <TextArea
                                        label="Ingrese el valor"
                                        name={name}
                                        value={value}
                                        onChange={onChange}
                                        error={error(name)}
                                        required={required(name)}
                                    />
                                )}
                            />
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    )
}

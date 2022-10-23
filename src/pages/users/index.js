import React from "react";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Title from "antd/lib/typography/Title";
import List from "antd/lib/list";
import Tag from "antd/lib/tag";
import { Button } from "../../components/ui";
import { Divider } from "antd";
import { useGlobalData } from "../../providers";

export const Users = () => {
  const { users } = useGlobalData();

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button type="primary" size="large" disabled={true}>
          Agregar usuario
        </Button>
      </Col>
      <Divider />
      <Col span={24}>
        <Title level={3}>Usuarios</Title>
      </Col>
      <Col span={24}>
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          loadMore={false}
          dataSource={users}
          renderItem={(user) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div>
                    <Title level={4}>{`${user.email} `}</Title>
                  </div>
                }
                description={
                  <>
                    <div>
                      <Title
                        level={5}
                      >{`${user?.firstName} ${user?.lastName}`}</Title>
                    </div>
                    <div>
                      <Title level={5}>
                        Rol: <Tag color="blue">{`${user?.roleCode}`}</Tag>
                      </Title>
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

import React, { useState } from "react";
import Row from "antd/lib/row";
import Title from "antd/lib/typography/Title";
import Text from "antd/lib/typography/Text";
import Col from "antd/lib/col";
import { Button } from "../../components/ui";
import { DrawerUserInformation } from "../../components/pages";
import { FloatingBubble } from "../../components/ui/FloatingBubble";

export const Home = () => {
  const [isVisibleDrawerRight, setIsVisibleDrawerRight] = useState(false);
  console.log("isVisibleDrawerRight->", isVisibleDrawerRight);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Button onClick={() => setIsVisibleDrawerRight(!isVisibleDrawerRight)}>
          Button
        </Button>
        <DrawerUserInformation
          setIsVisibleDrawerRight={setIsVisibleDrawerRight}
          isVisibleDrawerRight={isVisibleDrawerRight}
        />
        <FloatingBubble />
      </Col>
      <Col span={24}></Col>
    </Row>
  );
};

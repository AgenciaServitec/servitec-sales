// import React from "react";
// import Row from "antd/lib/row";
// import Col from "antd/lib/col";
// import Title from "antd/es/typography/Title";
// import { List, Skeleton } from "antd";
// import Avatar from "antd/lib/avatar/avatar";
// import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
//
// export const Home = () => {
//   return (
//     <Row gutter={[16, 16]}>
//       <Col span={24}>
//         <Title level={3}>Home</Title>
//       </Col>
//       <Col span={24}>
//         <List
//           className="demo-loadmore-list"
//           loading={false}
//           itemLayout="horizontal"
//           loadMore={false}
//           dataSource={[
//             { name: "Hola mundo", description: "description description" },
//           ]}
//           renderItem={() => (
//             <List.Item
//               actions={[
//                 <a key="list-loadmore-edit" href="#">
//                   <EditOutlined style={{ fontSize: "1.2rem" }} />
//                 </a>,
//                 <a key="list-loadmore-more" href="#">
//                   <DeleteOutlined style={{ fontSize: "1.2rem" }} />
//                 </a>,
//               ]}
//             >
//               <Skeleton avatar title={false} loading={false} active>
//                 <List.Item.Meta
//                   avatar={
//                     <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
//                   }
//                   title={<a href="https://ant.design">Titulo de anime</a>}
//                   description="Ant Design, a design language for background applications, is refined by Ant UED Team"
//                 />
//                 <div>content</div>
//               </Skeleton>
//             </List.Item>
//           )}
//         />
//       </Col>
//     </Row>
//   );
// };

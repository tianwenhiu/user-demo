import { Button, Col, Row } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    return <div>

        <Row gutter={20}>
            <Col>
            <img src={require("../image/image001.png")} />
            </Col>
            <Col>
                <Button type="primary" onClick={() => navigate('/users')}>用户列表</Button>
            </Col>
            <Col>
                <Button type="primary" onClick={() => navigate('/user-edit/0')}>添加用户</Button>
            </Col>
        </Row>

    </div>
};


export default Home;
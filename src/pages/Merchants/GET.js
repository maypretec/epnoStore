import MerchantService from "../../utils/api/merchants";
import {
    Card,
    Image,
    Tag,
    List,
    QRCode,
    Divider,
    Typography,
    Space,
    Row,
    Col,
    Badge,
    Skeleton,
    Statistic,
} from "antd";
import { useState, useEffect } from "react";
import AgentLayout from "../../layouts/ControlPanelLayout";
import { useParams } from "react-router-dom";

const { Title, Text, Link } = Typography;

export default function GetMerchant() {
    let { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({});
    const [address, setAddress] = useState({});

    useEffect(() => {
        MerchantService.MerchantsDummy(id).then((response) => {
            if (response.status === 200) {
                setProfile(response.data);
                setAddress(
                    response.data.payload.locations.find(
                        (location) => location.locatonType === "MainOffice"
                    )
                );
            }
            setLoading(false);
        });
    }, [loading]);


    function AsycLoad() {
        return (
            <>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
            </>
        );
    }
    const Loaded = () => {
        return (
            <AgentLayout>
                <Card
                    title={
                        <>
                            <Title level={2}>{profile.payload.name}</Title>
                        </>
                    }
                    extra={
                        <>
                            <Space wrap>
                                <Tag color="yellow">
                                    {" "}
                                    {profile.payload.industry}
                                </Tag>
                                <Tag color="purple">
                                    {profile.payload.businessType}
                                </Tag>
                            </Space>
                        </>
                    }
                >
                    <Row justify="space-between">
                        <Col span={8}>
                            <Divider orientation="left">
                                {profile.payload.legalName}
                            </Divider>
                            <Image
                                width={200}
                                src={
                                    profile.payload.logoUrl === null || profile.payload.logoUrl === ''
                                        ? "http://placekitten.com/200"
                                        : profile.payload.logoUrl
                                }
                            />
                        </Col>
                        <Col span={12}>
                            <Space direction="vertical">
                                <Divider orientation="left">
                                    {profile.payload.introductionMessage}
                                </Divider>
                                <Text>
                                    {address.address.street +
                                        " " +
                                        address.address.zipCode +
                                        " " +
                                        address.address.city +
                                        " " +
                                        address.address.state}
                                </Text>
                                <Divider orientation="left">Types</Divider>
                                {profile.payload.canBuy ? (
                                    <Tag color="blue"> Can Buy</Tag>
                                ) : null}
                                {profile.payload.canSell ? (
                                    <Tag color="green">Can Sell</Tag>
                                ) : null}
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space direction="vertical">
                                <Divider orientation="right">
                                    Since:&nbsp;
                                    <Link
                                        href={
                                            profile.payload.website === null || profile.payload.website === ''
                                                ? "https://epno.com.mx"
                                                : "https://" +
                                                  profile.payload.website
                                        }
                                    >
                                        {profile.payload.registrationCountry} -{" "}
                                        {profile.payload.registrationYear}
                                    </Link>
                                </Divider>
                                <QRCode
                                    value={
                                        profile.payload.website === null || profile.payload.website === ''
                                            ? "https://epno.com.mx"
                                            : profile.payload.website
                                    }
                                />
                            </Space>
                        </Col>
                    </Row>
                    <Divider />
                    <Row justify="space-between">
                        <Col span={10}>
                            <Space direction="vertical">
                                <List
                                    bordered
                                    header={
                                        <>
                                            <Row justify="space-between">
                                                <Col span={12}>
                                                    <Typography.Text strong>
                                                        Locations
                                                    </Typography.Text>
                                                </Col>
                                                <Col span={4}>
                                                    <Badge
                                                        showZero
                                                        count={2}
                                                        color="#52c41a"
                                                    />
                                                </Col>
                                            </Row>
                                        </>
                                    }
                                    dataSource={profile.payload.locations}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>
                                            {item.address.street +
                                                " " +
                                                item.address.zipCode +
                                                " " +
                                                item.address.city +
                                                " " +
                                                item.address.state}
                                        </List.Item>
                                    )}
                                />
                                <List>
                                    <List.Item>
                                        <Statistic
                                            title="Average Production Time"
                                            value={
                                                profile.payload
                                                    .averageProductionTime
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="Average Delivery Time"
                                            value={
                                                profile.payload
                                                    .averageDeliveryTime
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="Anual Sales"
                                            value={
                                                profile.payload.totalAnualSales
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="Minimum Order Size"
                                            value={
                                                profile.payload.minOrderValue
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="Export Percentage"
                                            value={
                                                profile.payload
                                                    .exportPercentage + "%"
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="Employees on Trade Dpt"
                                            value={
                                                profile.payload
                                                    .employeesInTradeDeparment
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="RnD Staff Size"
                                            value={profile.payload.rnDStaffSize}
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="Quality Staff Size"
                                            value={
                                                profile.payload.qualityStaffSize
                                            }
                                        />
                                    </List.Item>
                                    <List.Item>
                                        <Statistic
                                            title="Source Accross Multiple Industries"
                                            value={
                                                profile.payload
                                                    .sourceAccrossMultipleIndustries
                                                    ? "Yes"
                                                    : "No"
                                            }
                                        />
                                    </List.Item>
                                </List>
                            </Space>
                        </Col>
                        <Col span={10}>
                            <Space direction="vertical">
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Spoken Languages
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={2}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={profile.payload.spokenLanguages}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Showcase
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={4}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={
                                        profile.payload.customersShowcase
                                    }
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Prefered Industries
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={3}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={
                                        profile.payload.preferedIndustries
                                    }
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Delivery Terms
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={3}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={profile.payload.deliveryTerms}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Regions
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={3}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={profile.payload.regions}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Payment Options
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={4}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={profile.payload.paymentTypes}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Payment Terms
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={3}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={profile.payload.paymentTerms}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Currencies
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={3}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={
                                        profile.payload.acceptedCurrencies
                                    }
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Ports
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={3}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={profile.payload.nearestPorts}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                                <List
                                    bordered
                                    header={
                                        <Row justify="space-between">
                                            <Col span={12}>
                                                <Typography.Text strong>
                                                    Main Products
                                                </Typography.Text>
                                            </Col>
                                            <Col span={4}>
                                                <Badge
                                                    showZero
                                                    count={3}
                                                    color="#52c41a"
                                                />
                                            </Col>
                                        </Row>
                                    }
                                    dataSource={profile.payload.mainProducts}
                                    size="small"
                                    renderItem={(item) => (
                                        <List.Item>{item}</List.Item>
                                    )}
                                />
                            </Space>
                        </Col>
                    </Row>
                    <Divider />
                    <Row justify="right">
                        <Col span={4}>
                            <Tag>{profile.payload.referenceId}</Tag>
                            <Tag>{profile.payload.referenceOrigin}</Tag>
                        </Col>
                    </Row>
                </Card>
            </AgentLayout>
        );
    };
    return loading ? <AsycLoad /> : <Loaded />;
}

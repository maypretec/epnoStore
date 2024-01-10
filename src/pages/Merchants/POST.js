import MerchantService from "../../utils/api/merchants";
import {
    Card,
    Divider,
    Typography,
    Row,
    Col,
    Button,
    Select,
    Form,
    Input,
} from "antd";
import { useNavigate } from "react-router-dom";
import AgentLayout from "../../layouts/ControlPanelLayout";

export default function NewMerchant() {
    let history = useNavigate();
    const [form] = Form.useForm();
    const businessType = [
        { value: "Small Company", label: "Small Company" },
        { value: "Corporation", label: "Corporation" },
        { value: "Retail", label: "Retail" },
        { value: "Services", label: "Services" },
    ];
    const countries = [
        { value: "Mexico", label: "Mexico" },
        { value: "United States", label: "United States" },
        { value: "Colombia", label: "Colombia" },
        { value: "Canada", label: "Canada" },
    ];
//TODO create request transformer for merchant
    const SubmitMerchant = () => {
        
        const address = {
            name: form.getFieldValue('address-name'),
            officeSize: form.getFieldValue('address-officeSize'),
            locatonType: 'MainOffice',
            pictureUrl: null,
            phoneNumber: form.getFieldValue('address-phoneNumber'),
            timeZone: 'Central',
            address: {
                street: form.getFieldValue('address-street'),
                interiorNumber: null,
                city: form.getFieldValue('address-city'),
                state: form.getFieldValue('address-state'),
                zipCode: form.getFieldValue('address-zipCode'),
                zipCodeSuffix: null,
                country: form.getFieldValue('address-country'),
                latitude: -180.00,
                longitude: 180.00
            }
        }

        const merchant = {
            name: form.getFieldValue('merchant-name'),
            industry: form.getFieldValue('merchant-industry'),
            businessType: form.getFieldValue('merchant-bType'),
            legalName: form.getFieldValue('merchant-legalName'),
            registrationCountry: form.getFieldValue('merchant-country'),
            registrationYear: new Date().getFullYear(),
            locations: [
                address
            ]
        };

        MerchantService.NewMerchant(merchant)
        .then((response) => {
            if (response.status === 200) {
                history('/merchants/'.concat(response.data.payload.id));
            }
        })
    };
    return (
        <AgentLayout>
            <Card
                extra={
                    <Typography.Title level={2}>New Merchant</Typography.Title>
                }
            >
                <Row>
                    <Col span={8} offset={2}>
                        <Typography.Title level={3}>
                            General information
                        </Typography.Title>
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="merchant-name"
                                label="Company comercial name"
                                required
                            >
                                <Input placeholder="How people call your business" />
                            </Form.Item>
                            <Form.Item
                                name="merchant-industry"
                                label="Industry"
                                required
                            >
                                <Input placeholder="Like Procurement, Manufacturing, Service, Space, etc" />
                            </Form.Item>
                            <Form.Item
                                name="merchant-bType"
                                label="Business Type"
                                required
                            >
                                <Select
                                    showSearch
                                    placeholder="Select the best match"
                                    optionLabelProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    options={businessType}
                                />
                            </Form.Item>
                            <Form.Item
                                name="merchant-legalName"
                                label="Legal name"
                                required
                            >
                                <Input placeholder="Your company's legal name" />
                            </Form.Item>
                            <Form.Item
                                name="merchant-country"
                                label="Origin Country"
                                required
                            >
                                <Select
                                    showSearch
                                    placeholder="Select your country"
                                    optionLabelProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    options={countries}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={8} offset={4}>
                        <Typography.Title level={3}>
                            Main Address
                        </Typography.Title>
                        <Form form={form} layout="vertical" name="addresses">
                            <Form.Item label="Name" name="address-name">
                                <Input placeholder="What should we call you address?" />
                            </Form.Item>
                            <Form.Item label="Office Size" name="address-officeSize">
                                <Input placeholder="How many people work in this location?" />
                            </Form.Item>
                            <Form.Item label="Phone" name="address-phoneNumber">
                                <Input placeholder="Where can we reach you?" />
                            </Form.Item>
                            <Divider />
                            <Form.Item label="Street" name="address-street">
                                <Input />
                            </Form.Item>
                            <Form.Item label="City" name="address-city">
                                <Input />
                            </Form.Item>
                            <Form.Item label="State" name="address-state">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Zip code" name="address-zipCode">
                                <Input />
                            </Form.Item>
                            <Form.Item label="Country" name="address-country">
                            <Select
                                    showSearch
                                    placeholder="Select your country"
                                    optionLabelProp="children"
                                    filterOption={(input, option) =>
                                        (option?.label ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    options={countries}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Button
                        block
                        type="primary"
                        size="large"
                        onClick={SubmitMerchant}
                    >
                        Create!
                    </Button>
                </Row>
            </Card>
        </AgentLayout>
    );
}

// {
//     "satusCode": 200,
//     "message": "Success",
//     "payload": {
//         "orgId": "d62364e8-78f6-41ed-8a12-52e271b6b810",
//         "isActive": true,
//         "overallScore": 1,
//         "industry": "Agriculture",
//         "businessType": "Corporation",
//         "name": "Aqua Frontera",
//         "canSell": true,
//         "canBuy": true,
//         "legalName": "Agua Frontera SA de CV",
//         "registrationCountry": "Canada",
//         "registrationYear": 2023,
//         "introductionMessage": "",
//         "logoUrl": "",
//         "website": "",
//         "spokenLanguages": [],
//         "customersShowcase": [],
//         "preferedIndustries": [],
//         "deliveryTerms": [],
//         "nearestPorts": [],
//         "mainProducts": [],
//         "regions": [],
//         "paymentTypes": [],
//         "paymentTerms": [],
//         "acceptedCurrencies": [],
//         "averageProductionTime": "",
//         "averageDeliveryTime": "",
//         "totalAnualSales": "",
//         "minOrderValue": "",
//         "exportPercentage": 0,
//         "employeesInTradeDeparment": 0,
//         "rnDStaffSize": 0,
//         "qualityStaffSize": 0,
//         "sourceAccrossMultipleIndustries": true,
//         "locations": [
//             {
//                 "name": "Warehouse",
//                 "officeSize": 50,
//                 "locatonType": "MainOffice",
//                 "pictureUrl": null,
//                 "phoneNumber": "6569876543",
//                 "timeZone": "Central",
//                 "address": {
//                     "street": "Tecnologico",
//                     "interiorNumber": null,
//                     "city": "alameda",
//                     "state": "Texas",
//                     "zipCode": "45678",
//                     "zipCodeSuffix": null,
//                     "country": "Canada",
//                     "latitude": -180,
//                     "longitude": 180
//                 }
//             }
//         ],
//         "brands": [],
//         "acreditations": [],
//         "parthners": [],
//         "factories": [],
//         "tradeShows": [],
//         "meta": {},
//         "id": "3a563c69b7f840ea9e8673749ef0028a",
//         "referenceId": "",
//         "referenceOrigin": "",
//         "createdAt": "2023-07-14T19:21:30.2243831+00:00",
//         "updatedAt": "2023-07-14T19:21:30.2243832+00:00"
//     }
// }

import React, { Component, Fragment } from "react";
import axios from "axios";
import Button from '@material-ui/core/Button'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { Pagination } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Table from "../../components/Table";
import "./styles.css";
import Spinner from "../../components/Spinner";
import TextInput from "../../components/Input";
import Modal from '../../components/Modal';
import Dropdown from "../../components/Dropdown";
import RadioButton from "../../components/RadioButton";

let types = [
    { value: 'Face Cleansers', label: 'Face Cleansers' },
    { value: 'Toner and Mists', label: 'Toner and Mists' },
    { value: 'Eye Care', label: 'Eye Care' }
];

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
});

class Products extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headers: ["id", "Name", "Amount(each)", "Type", "Stock Remaining", "Description", ""],
            radioButtons: ["Face Cleansers", "Toner and Mists", "Eye Care", "all"],
            data: [],
            axios: false,
            create: false,
            edit: false,
            deleteRow: false,
            selectUserType: null,
            show: false,
            name: '',
            quantity: '',
            amount: '',
            description: '',
            id: '',
            activePage: 1,
            pagination: {},
            getUrl: '/api/products',
            radio: 'all',
            typeSelected: null
        };

        this.updateInputHandler = this.updateInputHandler.bind(this)
        this.onEditDetails = this.onEditDetails.bind(this)
        this.onDeleteProduct = this.onDeleteProduct.bind(this)
        this.onCreateProduct = this.onCreateProduct.bind(this)
        this.productManipulateHandler = this.productManipulateHandler.bind(this)
        this.onCloseModal = this.onCloseModal.bind(this)
        this.pageChangeHandler = this.pageChangeHandler.bind(this)
        this.selectRadioHandler = this.selectRadioHandler.bind(this)
        this.changeDropDownHandler = this.changeDropDownHandler.bind(this)
    }

    componentDidMount() {
        this.setState({
            axios: true
        });
        this.getProductsList()
    }

    // update inputs

    updateInputHandler(key, event) {
        var partialState = {};
        partialState[key] = event.target.value;
        this.setState(partialState);
    }

    changeDropDownHandler(typeSelected) {
        this.setState({ typeSelected });
    }

    // get lists 

    getProductsList() {
        axios.get(this.state.getUrl).then(response => {
            let data = [];
            data.push.apply(data, response.data.data.data);
            this.setState({
                data,
                pagination: response.data.pagination,
                axios: false
            });
        }).catch(err => {
            console.log(err.response);
            this.setState({
                axios: false
            })
        })
    }

    // add filter

    selectRadioHandler(e) {
        const value = e.target.value
        let getUrl = `/api/products?type=${value}`
        if (value === 'all') {
            getUrl = '/api/products'
        }
        this.setState({
            radio: value,
            getUrl,
        }, this.getProductsList)
    }

    // action buttons -> edit, delete, create

    onEditDetails(id) {
        const { data } = this.state
        var dataEach = data.find(each => {
            return each.id === id
        });
        const typeSelected = { value: dataEach.type, label: dataEach.type }
        this.setState({
            id,
            name: dataEach.name,
            amount: dataEach.amount,
            typeSelected,
            description: dataEach.description,
            quantity: dataEach.quantity,
            show: true,
            edit: true
        })
    }

    onDeleteProduct(id) {
        this.setState({ id, show: true, deleteRow: true })
    }

    onCreateProduct() {
        this.setState({ show: true, create: true })
    }

    // perform actions -> create, edit, delete

    productManipulateHandler(type) {
        const { name, amount, typeSelected, quantity, description, id } = this.state
        let data = {}

        switch (type) {
            case 'create':
                data = {
                    name, amount, type: typeSelected.label, quantity, description
                }
                axios.post('/api/products', data).then(response => {
                    if (response.data === 'Product created!') {
                        toast.success(response.data)
                        this.getProductsList()
                    } else {
                        toast.error('Some error occured!')
                    }
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            case 'edit':
                data = {
                    name, amount, type: typeSelected.label, quantity, description
                }
                axios.put(`/api/products/${id}`, data).then(response => {
                    if (response.data === 'Product Updated Successfully!!!') {
                        toast.success(response.data)
                        this.getProductsList()
                    } else {
                        toast.error('Some error occured!')
                    }
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            case 'delete':
                axios.delete(`/api/products/${id}`).then(response => {
                    if (response.data === 'Product Deleted Successfully!!!') {
                        toast.success(response.data)
                        this.getProductsList()
                    } else {
                        toast.error('Some error occured!')
                    }
                }).catch(err => {
                    console.log(err.response);
                })
                break;
            default:
                break;
        }
        this.setState({ show: false, edit: false, create: false, deleteRow: false })
    }

    // pagination

    pageChangeHandler(number) {
        let getUrl = `/api/products?page=${number}`
        if (this.state.radio !== 'all' && this.state.radio !== '') {
            getUrl = `/api/products?page=${number}&type=${this.state.radio}`
        }
        this.setState({ getUrl }, this.getProductsList)
    }

    renderPagination() {
        const { pagination } = this.state
        if (pagination.current_page) {
            let active = pagination.current_page;
            let items = [];
            for (let number = 1; number <= pagination.last_page; number++) {
                items.push(
                    <Pagination.Item
                        key={number}
                        onClick={() => this.pageChangeHandler(number)}
                        active={number === active}>
                        {number}
                    </Pagination.Item>
                );
            }

            return (
                <div>
                    <Pagination bsSize="medium">{items}</Pagination>
                </div>
            );
        }
    }

    // modal

    onCloseModal() {
        this.setState({ show: false, edit: false, create: false, deleteRow: false })
    }

    renderModal(type) {
        const { name, amount, typeSelected, description, quantity, show } = this.state
        return (
            <Modal show={show}>
                <div className="InputForm">
                    {type === 'delete'
                        ? <div>Are you sure you want to delete?</div>
                        : <Fragment>
                            <TextInput
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(val) => this.updateInputHandler('name', val)} />
                            <TextInput
                                type="number"
                                placeholder="Amount(per piece) in USD"
                                value={amount}
                                onChange={(val) => this.updateInputHandler('amount', val)} />
                            <Dropdown
                                placeholder="Type of Product"
                                value={typeSelected}
                                onChangeHandler={this.changeDropDownHandler}
                                options={types} />
                            <TextInput
                                type="number"
                                placeholder="Quantity"
                                value={quantity}
                                onChange={(val) => this.updateInputHandler('quantity', val)} />
                            <TextInput
                                isTextArea={true}
                                placeholder="Add description here..."
                                value={description}
                                onChange={(val) => this.updateInputHandler('description', val)} />
                        </Fragment>
                    }
                    <div className="FormButton">
                        <div className="FormButtonEach">
                            <Button variant="contained" onClick={() => this.productManipulateHandler(type)}>
                                {type === 'create'
                                    ? 'Create'
                                    : type === 'edit'
                                        ? 'Edit'
                                        : 'Delete'
                                }
                            </Button>
                        </div>
                        <div className="FormButtonEach">
                            <Button variant="contained" onClick={this.onCloseModal}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }

    renderTables() {
        const { data, headers } = this.state
        return (
            <div className="MainContainer">
                {!data.length
                    ? <div className="NoProducts">No Products To Display!!!</div>
                    : <div className="TableList">
                        <Table
                            headers={headers}
                            data={data}
                            onEditDetails={this.onEditDetails}
                            onDeleteProduct={this.onDeleteProduct} />
                    </div>
                }
            </div>
        )
    }

    render() {
        const { axios, create, edit, radioButtons } = this.state;
        const type = create
            ? 'create'
            : edit
                ? 'edit'
                : 'delete'

        return (
            <div className="Container">
                <ToastContainer />
                <div className="HeadingContainer m-b-md">Ayurvedic Products</div>
                <hr />
                <div className="ButtonContainer">
                    <div className="UpperContainer">
                        <div className="Filter">Apply Filter</div>
                        <div className="UpperRadio" onChange={this.selectRadioHandler}>
                            {radioButtons.map(each =>
                                <RadioButton text={each} />
                            )}
                        </div>
                    </div>
                    <MuiThemeProvider theme={theme}>
                        <Button
                            onClick={this.onCreateProduct}
                            variant="contained"
                            color="primary"
                            className="button">
                            Create User
                        </Button>
                    </MuiThemeProvider>
                </div>
                {!axios
                    ? (this.renderTables())
                    : (
                        <div className="SpinnerContainer">
                            <Spinner />
                        </div>
                    )
                }
                <div className="Pagination">
                    {this.renderPagination()}
                </div>
                {this.renderModal(type)}
            </div>

        );
    }
}

export default Products;
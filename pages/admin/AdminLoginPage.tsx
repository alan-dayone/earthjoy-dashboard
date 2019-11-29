/* tslint:disable:no-default-export */
import React, { Component } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from 'reactstrap';
import { guestOnly } from '../../hocs';
import { Link } from '../../routes';
import { ContentContainer } from '../../components';
import { Modal } from '../../components/Modal';

class AdminLoginPage extends Component {
  render() {
    return (
      <ContentContainer>
        <Modal></Modal>
      </ContentContainer>
    );
  }
}

export default guestOnly(AdminLoginPage, { useAdminLayout: true });

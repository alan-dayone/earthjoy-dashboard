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
  Row
} from 'reactstrap';
import { guestOnly } from '../../hocs';
import { Link } from '../../routes';

class AdminLoginPage extends Component {
  render() {
    return (
      <div className='app flex-row align-items-center'>
        <Container>
          <Row className='justify-content-center'>
            <Col md='6'>
              <Card className='p-4'>
                <CardBody>
                  <Form>
                    <h1>Login</h1>
                    <p className='text-muted'>Sign In to your account</p>
                    <InputGroup className='mb-3'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='fa fa-envelope' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='text'
                        placeholder='Email'
                        autoComplete='email'
                      />
                    </InputGroup>
                    <InputGroup className='mb-4'>
                      <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                          <i className='fa fa-lock' />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type='password'
                        placeholder='Password'
                        autoComplete='current-password'
                      />
                    </InputGroup>
                    <Row>
                      <Link route='/admin'>
                        <a>Go to dashboard</a>
                      </Link>
                      <Col xs='6'>
                        <Button color='primary' className='px-4'>
                          Login
                        </Button>
                      </Col>
                      <Col xs='6' className='text-right'>
                        <Button color='link' className='px-0'>
                          Forgot password?
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default guestOnly(AdminLoginPage, { useAdminLayout: true });

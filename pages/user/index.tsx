import { Component } from 'react';
import { compose } from 'recompose';

import { ContentContainer } from '../../components';
import { userOnly } from '../../hocs';

class User extends Component {
  render() {
    return (
      <ContentContainer>
        <div>User Only</div>
      </ContentContainer>
    );
  }
}

export default compose(userOnly)(User);

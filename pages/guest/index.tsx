import { Component } from 'react';
import { compose } from 'recompose';

import { ContentContainer } from '../../components';
import { index } from '../../hocs';

class Guest extends Component {
  render() {
    return (
      <ContentContainer>
        <div>Guest Only</div>
      </ContentContainer>
    );
  }
}

export default compose(index)(Guest);

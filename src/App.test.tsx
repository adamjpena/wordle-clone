import { render } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders the playable game shell', () => {
  const { getAllByRole, getByLabelText, getByRole } = render(<App />);

  expect(
    getByRole('heading', { name: /wordup/i })
  ).toBeInTheDocument();
  expect(
    getByRole('grid', { name: /word guesses/i })
  ).toBeInTheDocument();
  expect(getAllByRole('gridcell')).toHaveLength(30);
  expect(getByLabelText('Keyboard')).toBeInTheDocument();
  expect(
    getByRole('button', { name: /letter a/i })
  ).toBeInTheDocument();
});

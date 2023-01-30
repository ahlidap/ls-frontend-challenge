import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

test('full usage test - home, search, show user and list repos', async () => {
  render(<App />);
  const linkElement = screen.getByText(/GitHub User Search/i);
  expect(linkElement).toBeInTheDocument();

  // Check no results are being displayed
  const initialSearchResult = screen.getByText(/No results yet.. Try to search something/i);
  expect(initialSearchResult).toBeVisible();

  const fetchBtn = screen.getByRole("button", {name: /fetch/i});
  expect(fetchBtn).toBeInTheDocument();
  
  const input = screen.getByRole("textbox", {name: /query/i})
  expect(input.value).toBe("");
  


  // set search query and fetch data
  fireEvent.change(input, {target: {value: "ahlidap"}});
  expect(input.value).toBe("ahlidap");

  fireEvent.click(fetchBtn);
  
  // Wait for rendering
  await waitFor(() => expect(initialSearchResult).not.toBeVisible());
  expect(initialSearchResult).not.toBeVisible();
  
  // Now we should have a result
  const apiResult = screen.getByText(/https:\/\/api.github.com\/users\/ahlidap/i);
  expect(apiResult).toBeVisible();
  fireEvent.click(apiResult);
  
  // Show user info
  await waitFor(() => expect(apiResult).not.toBeVisible());
  expect(global.window.location.href).toBe("http://localhost/user/ahlidap");


  await waitFor(() => expect(screen.getByTestId("user-card")).toBeVisible());
  await waitFor(() => expect(screen.getAllByTestId("repo-entry")).toBeDefined());
  const repoEntries = screen.getAllByTestId("repo-entry");
  expect(repoEntries.length > 1).toBe(true);
  expect(repoEntries[0].textContent).toContain("ls-frontend-challenge");

});

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, Nav, Form, FormControl, Button, NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const token = readToken();

  async function handleSubmit(e) {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      const queryString = `title=true&q=${query}`;
      setSearchHistory(await addToHistory(queryString));
      setIsExpanded(false);
      router.push(`/artwork?${queryString}`);
    }
  }

  function logout() {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  }

  return (
    <>
      <Navbar className="fixed-top navbar-dark bg-primary" expand="lg" expanded={isExpanded}>
        <Navbar.Brand className="ms-2">Aliyah</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setIsExpanded(!isExpanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link legacyBehavior passHref href="/">
              <Nav.Link
                active={router.pathname === "/"}
                onClick={() => setIsExpanded(false)}
              >
                Home
              </Nav.Link>
            </Link>

            {token && (
              <Link legacyBehavior passHref href="/search">
                <Nav.Link
                  active={router.pathname === "/search"}
                  onClick={() => setIsExpanded(false)}
                >
                  Advanced Search
                </Nav.Link>
              </Link>
            )}
          </Nav>

          {token ? (
            <>
              &nbsp;<Form className="d-flex" onSubmit={handleSubmit}>
                <FormControl
                  name="search"
                  type="search"
                  placeholder="Search..."
                  className="me-2"
                />
                <Button type="submit" variant="outline-light">
                  Go
                </Button>
              </Form>&nbsp;

              <Nav>
                <NavDropdown title={token.userName} id="user-nav-dropdown" align="end">
                  <Link legacyBehavior passHref href="/favourites">
                    <NavDropdown.Item
                      active={router.pathname === "/favourites"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>
                  <Link legacyBehavior passHref href="/history">
                    <NavDropdown.Item
                      active={router.pathname === "/history"}
                      onClick={() => setIsExpanded(false)}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav>
              <Link legacyBehavior passHref href="/register">
                <Nav.Link
                  active={router.pathname === "/register"}
                  onClick={() => setIsExpanded(false)}
                >
                  Register
                </Nav.Link>
              </Link>
              <Link legacyBehavior passHref href="/login">
                <Nav.Link
                  active={router.pathname === "/login"}
                  onClick={() => setIsExpanded(false)}
                >
                  Login
                </Nav.Link>
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>
      <br />
      <br />
    </>
  );
}

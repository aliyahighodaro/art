import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Error from 'next/error';
import { Row, Col, Pagination, Card } from 'react-bootstrap';
import ArtworkCard from '@/components/ArtworkCard';
import validObjectIDList from '@/public/data/validObjectIDList.json';


const PER_PAGE = 12;

export default function ArtworkHome() {
  const router = useRouter();
  const finalQuery = router.asPath.split('?')[1]; 
  const [artworkList, setArtworkList] = useState();
  const [page, setPage] = useState(1);

  const { data, error } = useSWR(
    finalQuery
      ? `https://collectionapi.metmuseum.org/public/collection/v1/search?${finalQuery}`
      : null
  );

  useEffect(() => {
    if (data?.objectIDs?.length > 0) {
    let filteredResults = validObjectIDList.objectIDs.filter(x => data.objectIDs?.includes(x));

    const results = [];
    for (let i = 0; i < filteredResults.length; i += PER_PAGE) {
      const chunk = filteredResults.slice(i, i + PER_PAGE);
      results.push(chunk);
    }

    setArtworkList(results);
  }
}, [data]);

  function previousPage() {
    if (page > 1) setPage(page - 1);
  }
  function nextPage() {
    if (page < artworkList.length) setPage(page + 1);
  }

  if (error) return <Error statusCode={404} />;
  if (!artworkList) return null;

  return (
    <>
      <Row className="gy-4">
        {artworkList.length > 0 ? (
          artworkList[page - 1].map((id) => (
            <Col lg={3} key={id}>
              <ArtworkCard objectID={id} />
            </Col>
          ))
        ) : (
          <Col>
            <Card>
              <Card.Body>
                <h4>Nothing Here</h4>Try searching for something else.
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>

      {artworkList.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Pagination>
              <Pagination.Prev onClick={previousPage} />
              <Pagination.Item>{page}</Pagination.Item>
              <Pagination.Next onClick={nextPage} />
            </Pagination>
          </Col>
        </Row>
      )}
    </>
  );
}

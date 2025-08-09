import useSWR from 'swr';
import Error from 'next/error';
import Link from 'next/link';
import { Card, Button } from 'react-bootstrap';

export default function ArtworkCard({ objectID }) {
  const { data, error } = useSWR(
    `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
  );

  if (error) return <Error statusCode={404} />;
  if (!data) return null;

  const {
    primaryImageSmall,
    title,
    objectDate,
    classification,
    medium,
    objectID: id,
  } = data;

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={
          primaryImageSmall ||
          'https://via.placeholder.com/375x375.png?text=%5B+Not+Available+%5D'
        }
      />
      <Card.Body>
        <Card.Title>{title || 'N/A'}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {objectDate || 'N/A'}
          <br />
          <strong>Classification:</strong> {classification || 'N/A'}
          <br />
          <strong>Medium:</strong> {medium || 'N/A'}
        </Card.Text>
        <Link legacyBehavior passHref href={`/artwork/${id}`}>
          <Button variant="primary">ID: {id}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}

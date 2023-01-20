import fs from 'fs/promises'
import path from 'path'
import Link from 'next/link'

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {
        products.map( product => (
          <li key={product.id}>
            <Link href={`/${product.id}`}>
              {product.title}
            </Link>
          </li>
        ))
      }
    </ul>
  );
}

export async function getStaticProps() {
  const mockData = {products: []};
  console.log(mockData)
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData); //mockData;

  //The redirect property can be used to redirect to a different page basd on a specific condition
  if(!data) {
    return {
      redirect: {
        destination: '/no-data'
      }
    }
  }

  //The "notFound" property can be used to redirect to a 404 page based on a specific condition
  if (data.products.length === 0) {
    return { notFound: true }
  }

  return {
    props: {
      products : data.products
    },
    /*
      This property is for Incremental Static Generation (ISG).
      The getStaticProps pre load data during build time. And this is done one time. 
      So for site with data changing frequently, this property is used to statically rebuild or regenrate the page.
      It takes a value that wil be used to reload the data after the given value has expired.
      The value passed is the number of seconds that the server should wait to regenerate the page.
     */
    revalidate: 10  
  }
}

export default HomePage;

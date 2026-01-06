import axios from 'axios';
import { useState } from 'react'
import { LuTrash2 } from 'react-icons/lu';
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { toast } from 'react-toastify';

function ProductMedia({ game, id }) {
  const [youtube, setYoutube] = useState(game.youtube)
  const [image, setImage] = useState(game.image || [])
  const [loading, setLoading] = useState(false)
  const [update, setUpdate] = useState(false)

  const youtubeUrl = (url) => {
    if (!url) return "";

    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)?|youtu\.be\/)([\w-]{11})/
    );

    const videoId = match?.[1];

    setYoutube(videoId ? `https://www.youtube.com/embed/${videoId}` : url)
  };

  const deleteImage = (index) => {
    setImage((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });
  };

  const handleAddImage = (index, file) => {
    if (!file) return;
    setImage((prev) => {
      const updated = [...prev];
      updated[index] = `/assets/images/${file.name}`;
      return updated;
    });
  };

  const updateData = async () => {
    try {
      setLoading(true);
      await axios.patch(`http://localhost:3000/games/${id}`, {
        image: image,
        youtube: youtube
      });
      toast.success("Data Updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to Update Data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col gap-5 w-full border-4 dark:border-[#011743] border-gray-300 rounded-b p-5'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Gallery</h1>
        <button disabled={loading} onClick={() => updateData()} className="border-2 text-xl p-2 px-5 rounded font-bold cursor-pointer bg-gray-200 hover:bg-white dark:bg-[#011743] dark:hover:bg-[#030318] dark:hover:border-[#022771] dark:border-[#011743] border-gray-300">
          {loading ? <span>Saving....</span> : <span>Save Changes</span>}
        </button>
      </div>

      <div className='flex justify-between'>
        <div className='relative group flex flex-col text-center w-fit border dark:border-[#022771] border-gray-300 rounded'>
          <LazyLoadImage
            src={image[0] || "/assets/images/placeholder.webp"}
            effect="blur"
            className="h-38 w-63 rounded"
            alt={game.title}
          />
          <span className='text-xl py-2 font-semibold border-t dark:border-[#022771] border-gray-300'>Image 1 (cover)</span>
          {image[0] ?
            <div onClick={() => deleteImage(0)} className='w-fit opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1 p-1.5 text-xl rounded-full text-red-600 bg-red-600/40 hover:bg-red-600/60 hover:text-white cursor-pointer'>
              <LuTrash2 />
            </div>
            :
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAddImage(0, e.target.files[0])}
              className="absolute bottom-1 left-1 opacity-0 w-full h-full cursor-pointer"
            />}

        </div>
        <div className='relative group flex flex-col text-center w-fit border dark:border-[#022771] border-gray-300 rounded'>
          <LazyLoadImage
            src={image[1] || "/assets/images/placeholder.webp"}
            effect="blur"
            className="h-38 w-63 rounded"
            alt={game.title}
          />
          <span className='text-xl py-2 font-semibold border-t dark:border-[#022771] border-gray-300'>Image 2</span>
          {image[1] ?
            <div onClick={() => deleteImage(1)} className='w-fit opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1 p-1.5 text-xl rounded-full text-red-600  bg-red-600/40 hover:bg-red-600/60 hover:text-white cursor-pointer'>
              <LuTrash2 />
            </div>
            :
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAddImage(1, e.target.files[0])}
              className="absolute bottom-1 left-1 opacity-0 w-full h-full cursor-pointer"
            />}

        </div>
        <div className='relative group flex flex-col text-center w-fit border dark:border-[#022771] border-gray-300 rounded'>
          <LazyLoadImage
            src={image[2] || "/assets/images/placeholder.webp"}
            effect="blur"
            className="h-38 w-63 rounded"
            alt={game.title}
          />
          <span className='text-xl py-2 font-semibold border-t dark:border-[#022771] border-gray-300'>Image 3</span>
          {image[2] ?
            <div onClick={() => deleteImage(2)} className='w-fit opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1 p-1.5 text-xl rounded-full text-red-600  bg-red-600/40 hover:bg-red-600/60 hover:text-white cursor-pointer'>
              <LuTrash2 />
            </div>
            :
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAddImage(2, e.target.files[0])}
              className="absolute bottom-1 left-1 opacity-0 w-full h-full cursor-pointer"
            />}

        </div>
        <div className='relative group flex flex-col text-center w-fit border dark:border-[#022771] border-gray-300 rounded'>
          <LazyLoadImage
            src={image[3] || "/assets/images/placeholder.webp"}
            effect="blur"
            className="h-38 w-63 rounded"
            alt={game.title}
          />
          <span className='text-xl py-2 font-semibold border-t dark:border-[#022771] border-gray-300'>Image 4</span>
          {image[3] ?
            <div onClick={() => deleteImage(3)} className='w-fit opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1 p-1.5 text-xl rounded-full text-red-600  bg-red-600/40 hover:bg-red-600/60 hover:text-white cursor-pointer'>
              <LuTrash2 />
            </div>
            :
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAddImage(3, e.target.files[0])}
              className="absolute bottom-1 left-1 opacity-0 w-full h-full cursor-pointer"
            />}

        </div>
        <div className='relative group flex flex-col text-center w-fit border dark:border-[#022771] border-gray-300 rounded'>
          <LazyLoadImage
            src={image[4] || "/assets/images/placeholder.webp"}
            effect="blur"
            className="h-38 w-63 rounded"
            alt={game.title}
          />
          <span className='text-xl py-2 font-semibold border-t dark:border-[#022771] border-gray-300'>Image 5</span>
          {image[4] ?
            <div onClick={() => deleteImage(4)} className='w-fit opacity-0 group-hover:opacity-100 transition-opacity absolute right-1 top-1 p-1.5 text-xl rounded-full text-red-600  bg-red-600/40 hover:bg-red-600/60 hover:text-white cursor-pointer'>
              <LuTrash2 />
            </div>
            :
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleAddImage(4, e.target.files[0])}
              className="absolute bottom-1 left-1 opacity-0 w-full h-full cursor-pointer"
            />}

        </div>
      </div>
      <div className='flex flex-col gap-2'>
        <span className='text-xl'>YouTube Trailer</span>
        <div className='flex items-center justify-between gap-7'>
          <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} disabled={!update} className='border dark:border-[#011743] border-gray-300 rounded w-[100%] p-2 px-4 outline-none' placeholder='Enter Youtube Link' />
          <div onClick={() => { setUpdate(!update), youtubeUrl(youtube) }} className='border rounded p-2 w-50 text-center mr-3 dark:border-[#011743] border-gray-300 dark:bg-[#11113b] cursor-pointer dark:hover:bg-[#030318] font-semibold'>{update ? <span>Save Changes</span> : <span>Replace / Update</span>} </div>
        </div>
        <div className='p-2 mt-4'>
          <iframe
            src={`${youtube}?autoplay=1&mute=1&rel=0&controls=0`}
            title="Game Trailer"
            allow="autoplay; fullscreen"
            allowFullScreen
            width="100%"
            height="468"
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductMedia
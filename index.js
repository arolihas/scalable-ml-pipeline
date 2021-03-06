/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

// import constants from './config/constants'
// import firebase from 'firebase'

const MODEL_URL = './models/scene_v1_edge/model.json'

async function upload(input) {
  if (input.target.files.length > 0) {
    document.getElementById('scene').src = URL.createObjectURL(input.target.files[0])
  }
  // const ref = firebase.storage().ref()
  // const name = (+new Date()) + '-' + File.name
  // const metadata = { contentType: File.type }
  // const task = ref.child(name).put(file, metadata)
  // task
  //   .then(snapshot => snapshot.ref.getDownloadURL())
  //   .then((url) => {
  //     console.log.lg(url)
  //     document.querySelector('scene').src = url
  //   })
  //   .catch(console.error)
}

async function classify() {
  // Avoid duplicate request
  if (document.getElementsByTagName('pre').length > 0) {
    return
  }
  const model = await tf.automl.loadImageClassification(MODEL_URL);
  const image = document.getElementById('scene');
  const predictions = await model.classify(image);

  // Show the resulting object on the page.
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(predictions, null, 2);
  document.body.append(pre);
}

document.getElementById('classifier').onclick = classify.bind();
document.getElementById('uploader').onchange = upload.bind();
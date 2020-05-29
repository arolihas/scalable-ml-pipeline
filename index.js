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

import * as automl from '@tensorflow/tfjs-automl';

const MODEL_URL =
	'https://storage.googleapis.com/scalepipe_models/model-export/icn/tf_js-scene_v1_edge-2020-05-28T20:23:55.321Z/model.json'
  //'models/scene_v1_edge/model.json'
async function classify() {
  // Avoid duplicate request
  if (document.getElementsByTagName('pre').length > 0) {
    return
  }
  const model = await automl.loadImageClassification(MODEL_URL);
  const image = document.getElementById('scene');
  const predictions = await model.classify(image);

  // Show the resulting object on the page.
  const pre = document.createElement('pre');
  pre.textContent = JSON.stringify(predictions, null, 2);
  document.body.append(pre);
}

document.getElementById('classifier').onclick = classify.bind();